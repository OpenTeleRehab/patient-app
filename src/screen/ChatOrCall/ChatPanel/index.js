/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useState} from 'react';
import {Text, withTheme} from 'react-native-elements';
import {GiftedChat} from 'react-native-gifted-chat';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Rocketchat} from '../../../services/rocketchat';
import HeaderBar from '../../../components/Common/HeaderBar';
import settings from '../../../../config/settings';
import {generateHash, isPhcWorker} from '../../../utils/helper';
import {Platform, View, Keyboard} from 'react-native';
import {CALL_STATUS, CHAT_USER_STATUS} from '../../../variables/constants';
import RocketchatContext from '../../../context/RocketchatContext';
import {loadHistoryInRoom, sendNewMessage} from '../../../utils/rocketchat';
import {updateIndicatorList} from '../../../store/indicator/actions';
import {mutation} from '../../../store/rocketchat/mutations';
import MediaPicker from '../../../components/MediaPicker';
import {
  postAttachmentMessage,
  prependNewMessage,
  sendPodcastNotification,
} from '../../../store/rocketchat/actions';
import ChatContainer from '../_Partials/ChatContainer';
import ChatToolbar from '../_Partials/ChatToolbar';
import ChatMediaSlider from '../_Partials/ChatMediaSlider';
import styles from '../../../assets/styles';

const ChatPanel = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const localize = useSelector((state) => state.localize);
  const {chatAuth, messages, selectedRoom, chatRooms, offlineMessages} =
    useSelector((state) => state.rocketchat);
  const {isOnlineMode, isOnChatScreen} = useSelector(
    (state) => state.indicator,
  );
  const {profile} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  const [allMessages, setAllMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const isFocused = useIsFocused();
  const [showMediaSlider, setShowMediaSlider] = useState(false);
  const [isVideoAttachment, setIsVideoAttachment] = useState(false);
  const [videoAttachments, setVideoAttachments] = useState(undefined);
  const [imageAttachments, setImageAttachments] = useState(undefined);
  const [currentAttachment, setCurrentAttachment] = useState(undefined);

  useEffect(() => {
    navigation.getParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.getParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  useEffect(() => {
    setAllMessages(messages);
  }, [chatRooms, messages]);

  useEffect(() => {
    if (isOnlineMode && isOnChatScreen && chatSocket && selectedRoom?.id) {
      Rocketchat.markMessagesAsRead(
        selectedRoom.rid,
        chatAuth.userId,
        chatAuth.token,
      ).then((res) => {
        if (res.success) {
          // Load message history in room
          loadHistoryInRoom(chatSocket, selectedRoom.rid, profile.id);

          // Reset unread message
          dispatch(mutation.updateUnreadSuccess(selectedRoom.rid));
        }
      });
    }
  }, [
    chatAuth.token,
    chatAuth.userId,
    chatSocket,
    dispatch,
    isOnChatScreen,
    isOnlineMode,
    profile.id,
    selectedRoom,
  ]);

  useEffect(() => {
    const fIndex = chatRooms.findIndex((cr) => cr.rid === selectedRoom.rid);
    if (fIndex !== -1) {
      setVideoAttachments(
        chatRooms[fIndex].messages
          .filter((item) => item.video !== '')
          .reverse(),
      );
      setImageAttachments(
        chatRooms[fIndex].messages
          .filter((item) => item.image !== '')
          .reverse(),
      );
    }
  }, [messages, currentAttachment, isVideoAttachment, chatRooms, selectedRoom]);

  useEffect(() => {
    if (isOnChatScreen !== isFocused) {
      dispatch(updateIndicatorList({isOnChatScreen: isFocused}));
    }
  }, [dispatch, isFocused, isOnChatScreen]);

  const onSend = (newMessage = []) => {
    newMessage[0].rid = selectedRoom.rid;

    if (isOnlineMode) {
      newMessage[0].received = true;
      newMessage[0].pending = false;

      sendNewMessage(chatSocket, newMessage[0], profile.id);
    } else {
      newMessage[0].received = false;
      newMessage[0].pending = true;

      dispatch(
        mutation.setOfflineMessagesSuccess(
          offlineMessages.concat([newMessage[0]]),
        ),
      );
      dispatch(prependNewMessage(newMessage[0]));
    }

    setAllMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage),
    );
  };

  const onSendAttachment = (caption, file, type) => {
    const newMessage = {
      _id: generateHash(),
      rid: selectedRoom.rid,
      createdAt: new Date(),
      received: true,
      pending: false,
      text: caption,
      user: {_id: chatAuth.userId},
    };
    if (type.includes('video/')) {
      newMessage.video = file.uri;
    } else {
      newMessage.image = file.uri;
    }
    setAllMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [newMessage]),
    );

    const attachment = {
      caption,
      file: {
        uri:
          Platform.OS === 'android'
            ? file.uri
            : file.uri.replace('file://', ''),
        type,
        name: file.uri.replace(/^.*[\\/]/, ''),
      },
    };
    newMessage.attachment = attachment;
    if (isOnlineMode) {
      dispatch(postAttachmentMessage(selectedRoom.rid, attachment));
    } else {
      dispatch(
        mutation.setOfflineMessagesSuccess(
          offlineMessages.concat([newMessage]),
        ),
      );
      dispatch(prependNewMessage(newMessage));
    }
  };

  const renderMessage = (chatProps) => {
    return (
      <ChatContainer
        chatData={chatProps}
        onShowMediaSlider={setShowMediaSlider}
        onCurrentAttachment={setCurrentAttachment}
        isVideoAttachment={setIsVideoAttachment}
        theme={theme}
        translate={translate}
      />
    );
  };

  const renderFooter = () => {
    if (selectedRoom.u?.status === CHAT_USER_STATUS.OFFLINE) {
      return (
        <View style={[styles.flexCenter, styles.paddingXLg, styles.paddingYMd]}>
          <Text style={styles.chatTherapistNotOnlineText}>
            {translate('chat_message.therapist_is_not_online')}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderInputToolbar = (chatProps) => {
    return (
      <ChatToolbar
        chatData={chatProps}
        theme={theme}
        translate={translate}
        onShowPicker={setShowPicker}
      />
    );
  };

  const handleGoBack = () => {
    navigation.getParent().setOptions({tabBarVisible: true});
    Keyboard.dismiss();
    navigation.goBack();
  };

  const handleCall = async (isVideo) => {
    const _id = generateHash();
    const rid = selectedRoom.rid;
    const text = isVideo
      ? CALL_STATUS.VIDEO_STARTED
      : CALL_STATUS.AUDIO_STARTED;

    // Send call message
    sendNewMessage(chatSocket, {_id, rid, text}, profile.id);

    dispatch(mutation.showIncomingCall(true));
    dispatch(mutation.hasStartedCall(true));

    // Send podcast notification
    if (selectedRoom.u.status === CHAT_USER_STATUS.OFFLINE) {
      const notification = {
        _id,
        rid,
        identity: selectedRoom.u.username,
        title: profile.first_name + ' ' + profile.last_name,
        body: text,
        translatable: false,
      };

      dispatch(sendPodcastNotification(notification));
    }
  };

  return (
    <>
      {isPhcWorker(profile?.type) ? (
        <HeaderBar
          backgroundPrimary
          onGoBack={() => handleGoBack()}
          title={selectedRoom?.name}
          call={{
            onAudioCall: () => handleCall(false),
            onVideoCall: () => handleCall(true),
          }}
        />
      ) : (
        <HeaderBar
          backgroundPrimary
          onGoBack={() => handleGoBack()}
          title={selectedRoom?.name}
        />
      )}
      <GiftedChat
        isTyping={true}
        messages={allMessages}
        placeholder={translate('chat.type.message')}
        messagesContainerStyle={styles.chatMainContainer}
        messageIdGenerator={() => generateHash()}
        textInputProps={{selectionColor: theme.colors.primary}}
        user={{_id: profile.chat_user_id}}
        renderMessage={renderMessage}
        renderInputToolbar={renderInputToolbar}
        renderFooter={renderFooter}
        onSend={(newMessage) => onSend(newMessage)}
      />
      {showPicker && (
        <MediaPicker
          visible={showPicker}
          onClose={setShowPicker}
          onSend={onSendAttachment}
          allPhotoText={translate('all_photos')}
          allVideoText={translate('all_videos')}
          emptyText={translate('no_photo')}
          captionPlaceholder={translate('add_a_caption')}
          sizeErrorText={translate('common.error_message_invalid_file_size', {
            size: settings.fileMaxUploadSize,
          })}
          buttonOKLabel={translate('common.ok')}
        />
      )}
      {showMediaSlider && (
        <ChatMediaSlider
          theme={theme}
          items={isVideoAttachment ? videoAttachments : imageAttachments}
          currentAttachment={currentAttachment}
          onShowMediaSlider={setShowMediaSlider}
          isVideoAttachment={isVideoAttachment}
        />
      )}
    </>
  );
};

export default withTheme(ChatPanel);
