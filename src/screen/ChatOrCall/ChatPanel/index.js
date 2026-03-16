/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useState} from 'react';
import {Text, withTheme} from 'react-native-elements';
import {GiftedChat} from 'react-native-gifted-chat';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Rocketchat} from '../../../services/rocketchat';
import HeaderBar from '../../../components/Common/HeaderBar';
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
  const insets = useSafeAreaInsets();
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
    setAllMessages(messages);
  }, [chatRooms, messages]);

  useEffect(() => {
    if (isOnlineMode && isOnChatScreen && chatSocket && selectedRoom?.rid) {
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

      // Send chat message
      sendNewMessage(chatSocket, newMessage[0], profile.id);

      // Push chat message notification
      dispatch(
        sendPodcastNotification({
          _id: newMessage[0].id,
          rid: newMessage[0].rid,
          identity: selectedRoom.u.username,
          title: profile.last_name + ' ' + profile.first_name,
          body: newMessage[0].text,
        }),
      );
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

      dispatch(
        sendPodcastNotification({
          _id: newMessage._id,
          rid: newMessage.rid,
          identity: selectedRoom.u.username,
          title: profile.last_name + ' ' + profile.first_name,
          body: 'chat_attachment.title',
          translatable: true,
        }),
      );
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
    if (selectedRoom?.u?.status === CHAT_USER_STATUS.OFFLINE) {
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
    dispatch(
      sendPodcastNotification({
        _id,
        rid,
        identity: selectedRoom.u.username,
        title: profile.first_name + ' ' + profile.last_name,
        body: text,
        translatable: false,
      }),
    );
  };

  return (
    <>
      {isPhcWorker(profile?.type) ? (
        <HeaderBar
          title={selectedRoom?.name}
          onGoBack={() => handleGoBack()}
          call={{
            onAudioCall: () => handleCall(false),
            onVideoCall: () => handleCall(true),
          }}
        />
      ) : (
        <HeaderBar
          onGoBack={() => handleGoBack()}
          title={selectedRoom?.name}
        />
      )}
      <GiftedChat
        messages={allMessages}
        placeholder={translate('chat.type.message')}
        messagesContainerStyle={styles.chatMainContainer}
        messageIdGenerator={() => generateHash()}
        keyboardAvoidingViewProps={{
          behavior: Platform.OS === 'ios' ? 'padding' : 'height',
          keyboardVerticalOffset: 64 + insets.top + insets.bottom,
        }}
        keyboardProviderProps={{
          navigationBarTranslucent: false,
        }}
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
          onSend={onSendAttachment}
          onClose={setShowPicker}
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
