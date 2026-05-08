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
import {Platform, View} from 'react-native';
import {CALL_STATUS, CHAT_USER_STATUS} from '../../../variables/constants';
import RocketchatContext from '../../../context/RocketchatContext';
import {loadHistoryInRoom} from '../../../utils/rocketchat';
import {updateIndicatorList} from '../../../store/indicator/actions';
import {mutation} from '../../../store/rocketchat/mutations';
import MediaPicker from '../../../components/MediaPicker';
import {postAttachmentMessage, sendTextMessage} from '../../../store/rocketchat/actions';
import ChatContainer from '../_Partials/ChatContainer';
import ChatToolbar from '../_Partials/ChatToolbar';
import ChatMediaSlider from '../_Partials/ChatMediaSlider';
import styles from '../../../assets/styles';
import store from '../../../store';

const ChatPanel = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const localize = useSelector((state) => state.localize);
  const {isOnlineMode, isOnChatScreen} = useSelector((state) => state.indicator);
  const {
    chatAuth,
    messages,
    showIncomingCall,
    showAcceptedCall,
    selectedRoom,
    chatRooms,
  } = useSelector((state) => state.rocketchat);
  const {profile} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  const [allMessages, setAllMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [disabledCall, setDisabledCall] = useState(false);
  const [showMediaSlider, setShowMediaSlider] = useState(false);
  const [isVideoAttachment, setIsVideoAttachment] = useState(false);
  const [videoAttachments, setVideoAttachments] = useState(undefined);
  const [imageAttachments, setImageAttachments] = useState(undefined);
  const [currentAttachment, setCurrentAttachment] = useState(undefined);

  const keyboardVerticalOffset = isOnlineMode
    ? 64 + insets.top
    : 100 + insets.top;

  useEffect(() => {
    if (!showIncomingCall && !showAcceptedCall) {
      setDisabledCall(false);
    }
  }, [showIncomingCall, showAcceptedCall]);

  useEffect(() => {
    setAllMessages(messages);
  }, [messages]);

  useEffect(() => {
    let intervalID;

    if (isOnlineMode) {
      intervalID = setInterval(() => {
        if (chatSocket && chatSocket.OPEN === chatSocket.readyState) {
          loadHistoryInRoom(chatSocket, selectedRoom.rid, profile.id);

          Rocketchat.markMessagesAsRead(
            selectedRoom.rid,
            chatAuth.userId,
            chatAuth.token,
          ).then((res) => {
            if (res.success) {
              dispatch(mutation.updateUnreadSuccess(selectedRoom.rid));
            }
          });

          clearInterval(intervalID);
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [chatAuth, chatSocket, dispatch, profile.id, selectedRoom, isOnlineMode]);

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
    newMessage[0].received = false;
    newMessage[0].pending = true;
    newMessage[0].user = {
      ...newMessage[0].user,
      username: selectedRoom.u.username,
    };

    if (isOnlineMode) {
      dispatch(sendTextMessage(chatSocket, newMessage[0]));
    } else {
      const offlineMessages = store.getState().rocketchat.offlineMessages;
      const allOfflineMessages = offlineMessages.concat([newMessage[0]]);

      dispatch(mutation.setOfflineMessagesSuccess(allOfflineMessages));
      dispatch(mutation.prependNewMessageSuccess(newMessage[0]));
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
      received: false,
      pending: true,
      text: caption,
      user: {
        _id: profile.chat_user_id,
        username: selectedRoom.u.username,
      },
    };
    if (type.includes('video/')) {
      newMessage.video = file.uri;
    } else {
      newMessage.image = file.uri;
    }
    setAllMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [newMessage]),
    );

    newMessage.attachment = {
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

    if (isOnlineMode) {
      dispatch(postAttachmentMessage(newMessage));
    } else {
      const offlineMessages = store.getState().rocketchat.offlineMessages;
      const allOfflineMessages = offlineMessages.concat([newMessage]);

      dispatch(mutation.setOfflineMessagesSuccess(allOfflineMessages));
      dispatch(mutation.prependNewMessageSuccess(newMessage));
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
    navigation.goBack();
  };

  const handleCall = async (isVideo) => {
    const message = {
      _id: generateHash(),
      rid: selectedRoom.rid,
      user: {
        _id: chatAuth.userId,
        username: selectedRoom.u.username,
      },
      text: isVideo ? CALL_STATUS.VIDEO_STARTED : CALL_STATUS.AUDIO_STARTED,
    };

    setDisabledCall(true); // Avoid multiple press

    dispatch(sendTextMessage(chatSocket, message));
    dispatch(mutation.showIncomingCall(true));
    dispatch(mutation.hasStartedCall(true));
  };

  return (
    <>
      {isPhcWorker(profile?.type) ? (
        <HeaderBar
          title={selectedRoom?.name}
          onGoBack={() => handleGoBack()}
          call={{
            disabledCall: disabledCall,
            onAudioCall: () => handleCall(false),
            onVideoCall: () => handleCall(true),
          }}
        />
      ) : (
        <HeaderBar onGoBack={() => handleGoBack()} title={selectedRoom?.name} />
      )}
      <GiftedChat
        messages={allMessages}
        placeholder={translate('chat.type.message')}
        messagesContainerStyle={styles.chatMainContainer}
        messageIdGenerator={() => generateHash()}
        keyboardAvoidingViewProps={{
          behavior: Platform.OS === 'ios' ? 'padding' : 'height',
          keyboardVerticalOffset: keyboardVerticalOffset,
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
