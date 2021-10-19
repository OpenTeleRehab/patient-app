/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useState} from 'react';
import {Text, withTheme} from 'react-native-elements';
import {GiftedChat} from 'react-native-gifted-chat';
import {useIsFocused} from '@react-navigation/native';
import styles from '../../../assets/styles';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import settings from '../../../../config/settings';
import {generateHash} from '../../../utils/helper';
import {Platform, View, Keyboard} from 'react-native';
import {CHAT_USER_STATUS} from '../../../variables/constants';
import RocketchatContext from '../../../context/RocketchatContext';
import {sendNewMessage} from '../../../utils/rocketchat';
import {updateIndicatorList} from '../../../store/indicator/actions';
import MediaPicker from '../../../components/MediaPicker';
import {
  postAttachmentMessage,
  prependNewMessage,
} from '../../../store/rocketchat/actions';
import ChatContainer from '../_Partials/ChatContainer';
import ChatToolbar from '../_Partials/ChatToolbar';
import ChatMediaSlider from '../_Partials/ChatMediaSlider';
import {mutation} from '../../../store/rocketchat/mutations';
import Spinner from 'react-native-loading-spinner-overlay';

const ChatPanel = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const localize = useSelector((state) => state.localize);
  const {
    chatAuth,
    messages,
    selectedRoom,
    chatRooms,
    offlineMessages,
  } = useSelector((state) => state.rocketchat);
  const {token, userId} = chatAuth || {};
  const {isOnlineMode, isOnChatScreen, hasUnreadMessage} = useSelector(
    (state) => state.indicator,
  );
  const profile = useSelector((state) => state.user.profile);
  const translate = getTranslate(localize);
  const [allMessages, setAllMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [showMediaSlider, setShowMediaSlider] = useState(false);
  const [isVideoAttachment, setIsVideoAttachment] = useState(false);
  const [videoAttachments, setVideoAttachments] = useState(undefined);
  const [imageAttachments, setImageAttachments] = useState(undefined);
  const [currentAttachment, setCurrentAttachment] = useState(undefined);

  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  });

  useEffect(() => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  useEffect(() => {
    if (isOnlineMode) {
      setAllMessages(messages);
    } else {
      const fIndex = chatRooms.findIndex((cr) => cr.rid === selectedRoom.rid);
      if (fIndex !== -1) {
        setAllMessages(chatRooms[fIndex].messages);
      }
    }
  }, [dispatch, chatRooms, selectedRoom, messages, isOnlineMode]);

  useEffect(() => {
    const hasUnreadMessages = chatRooms.filter((item) => item.unreads > 0);
    if (hasUnreadMessages.length === 0 && isOnlineMode) {
      dispatch(updateIndicatorList({hasUnreadMessage: false}));
    }
  }, [dispatch, chatRooms, selectedRoom, isOnlineMode]);

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
  }, [
    dispatch,
    isFocused,
    isOnChatScreen,
    hasUnreadMessage,
    chatSocket,
    selectedRoom,
    profile,
    userId,
    token,
  ]);

  const onSend = (newMessage = []) => {
    newMessage[0].pending = true;
    setAllMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage),
    );
    newMessage[0].rid = selectedRoom.rid;
    if (isOnlineMode) {
      sendNewMessage(chatSocket, newMessage[0], profile.id);
    } else {
      dispatch(
        mutation.setOfflineMessagesSuccess(
          offlineMessages.concat([newMessage[0]]),
        ),
      );
      dispatch(prependNewMessage(newMessage[0]));
    }
  };

  const onSendAttachment = (caption, file, type) => {
    const newMessage = {
      _id: generateHash(),
      rid: selectedRoom.rid,
      createdAt: new Date(),
      pending: true,
      text: caption,
      user: {_id: profile.chat_user_id},
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
    if (selectedRoom.u.status === CHAT_USER_STATUS.OFFLINE) {
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
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    Keyboard.dismiss();
    navigation.goBack();
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={true}
        onGoBack={() => handleGoBack()}
        title={selectedRoom.name}
      />
      <Spinner
        visible={isLoading}
        textContent={translate('common.loading')}
        textStyle={styles.textLight}
        overlayColor={theme.colors.platform.android.primary}
      />
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
