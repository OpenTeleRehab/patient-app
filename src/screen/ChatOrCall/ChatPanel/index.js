/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Text, withTheme} from 'react-native-elements';
import {GiftedChat} from 'react-native-gifted-chat';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Rocketchat} from '../../../services/rocketchat';
import HeaderBar from '../../../components/Common/HeaderBar';
import {generateHash, getMessageTime, isPhcWorker} from '../../../utils/helper';
import {AppState, Platform, View} from 'react-native';
import {CALL_STATUS, CHAT_USER_STATUS, ROUTES} from '../../../variables/constants';
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

// Stable fallback so a room without history doesn't hand the messages effect a new array on every render.
const NO_MESSAGES = [];

const ChatPanel = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const localize = useSelector((state) => state.localize);
  const {isOnlineMode, isOnChatScreen} = useSelector((state) => state.indicator);
  const {
    chatAuth,
    showIncomingCall,
    showAcceptedCall,
    selectedRoom: selectedRoomSnapshot,
    chatRooms,
    loadingEarlierRoomId,
  } = useSelector((state) => state.rocketchat);
  const {profile} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  // Effects key on ids, not objects: the live room below is replaced on every message and presence change, and
  // profile on every re-login; each re-run of the history effect reloads the whole history and marks it read.
  const selectedRoomId = selectedRoomSnapshot?.rid;
  const profileId = profile?.id;
  // The store's selectedRoom only says which room is open (a copy taken when it was selected). Show the live
  // room from chatRooms, the single copy the reducers keep current (history, presence, name); fall back to the
  // copy if a reload dropped the room, so this screen keeps working until the user leaves it.
  const selectedRoom = useMemo(
    () => chatRooms.find((room) => room.rid === selectedRoomId) ?? selectedRoomSnapshot,
    [chatRooms, selectedRoomId, selectedRoomSnapshot],
  );
  const messages = selectedRoom?.messages ?? NO_MESSAGES;
  // Start from the saved history: this screen mounts on every open, and [] would flash an empty chat first.
  const [allMessages, setAllMessages] = useState(messages);
  const [showPicker, setShowPicker] = useState(false);
  const [disabledCall, setDisabledCall] = useState(false);
  const [showMediaSlider, setShowMediaSlider] = useState(false);
  const [isVideoAttachment, setIsVideoAttachment] = useState(false);
  const [videoAttachments, setVideoAttachments] = useState(undefined);
  const [imageAttachments, setImageAttachments] = useState(undefined);
  const [currentAttachment, setCurrentAttachment] = useState(undefined);
  // Reachable via tab bar / notification, or on reconnect, before the Rocket.Chat login reply sets chatAuth.
  const waitingForChatLogin = isOnlineMode && !chatAuth;

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

    if (isOnlineMode && selectedRoomId && profileId && chatAuth?.userId) {
      intervalID = setInterval(() => {
        if (chatSocket && chatSocket.OPEN === chatSocket.readyState) {
          loadHistoryInRoom(chatSocket, selectedRoomId, profileId);

          Rocketchat.markMessagesAsRead(
            selectedRoomId,
            chatAuth.userId,
            chatAuth.token,
          ).then((res) => {
            if (res.success) {
              dispatch(mutation.updateUnreadSuccess(selectedRoomId));
            }
          });

          clearInterval(intervalID);
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [chatAuth, chatSocket, dispatch, profileId, selectedRoomId, isOnlineMode]);

  // Messages that arrived while the app was in the background stay unread (see prependNewMessage);
  // coming back to this chat is when they are actually seen.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active' || !isFocused || !selectedRoomId || !chatAuth?.userId) {
        return;
      }

      Rocketchat.markMessagesAsRead(selectedRoomId, chatAuth.userId, chatAuth.token).then((res) => {
        if (res.success) {
          dispatch(mutation.updateUnreadSuccess(selectedRoomId));
        }
      });
    });

    return () => subscription.remove();
  }, [chatAuth, dispatch, isFocused, selectedRoomId]);

  useEffect(() => {
    // Queued attachments (and ones persisted by older versions) may lack the other media field.
    setVideoAttachments(messages.filter((item) => !!item.video).reverse());
    setImageAttachments(messages.filter((item) => !!item.image).reverse());
  }, [messages, currentAttachment, isVideoAttachment]);

  useEffect(() => {
    if (isOnChatScreen !== isFocused) {
      dispatch(updateIndicatorList({isOnChatScreen: isFocused}));
    }
  }, [dispatch, isFocused, isOnChatScreen]);

  // In the stack, going back unmounts this screen, possibly before a blur re-render reaches the effect above;
  // a stale isOnChatScreen would mark messages read (and hide their badge) while nobody is looking.
  useEffect(() => () => dispatch(updateIndicatorList({isOnChatScreen: false})), [dispatch]);

  // isOnlineMode lags behind the socket: right after the network drops (or before the reconnect login
  // finishes) the socket is closed while we still look online, and a message sent then is silently lost.
  const canSendNow = () => {
    return (
      isOnlineMode && !!chatAuth && chatSocket?.readyState === WebSocket.OPEN
    );
  };

  // Kept in the store with pending: true until the server echoes it back after sendOfflineMessages.
  const queueOfflineMessage = (message) => {
    const {offlineMessages} = store.getState().rocketchat;

    dispatch(mutation.setOfflineMessagesSuccess(offlineMessages.concat([message])));
    dispatch(mutation.prependNewMessageSuccess(message));
    dispatch(mutation.updateLastMessageSuccess(message));
  };

  const onSend = (newMessage = []) => {
    newMessage[0].rid = selectedRoom.rid;
    newMessage[0].received = false;
    newMessage[0].pending = true;
    newMessage[0].user = {
      ...newMessage[0].user,
      username: selectedRoom.u.username,
    };

    if (canSendNow()) {
      dispatch(sendTextMessage(chatSocket, newMessage[0]));
    } else {
      queueOfflineMessage(newMessage[0]);
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
      image: '',
      video: '',
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

    if (canSendNow()) {
      dispatch(postAttachmentMessage(newMessage));
    } else {
      queueOfflineMessage(newMessage);
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
    // Presence is stale while we're offline, so treat the other side as offline too.
    if (!isOnlineMode || selectedRoom?.u?.status === CHAT_USER_STATUS.OFFLINE) {
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
        loading={waitingForChatLogin}
      />
    );
  };

  // Older pages come from the server, so only while the chat socket is usable; hasMoreHistory is set by the
  // first page's reply and stays false for a room whose whole history is already loaded.
  const canLoadEarlier = canSendNow() && !!selectedRoom?.hasMoreHistory;
  const isLoadingEarlier = loadingEarlierRoomId === selectedRoomId;

  const handleLoadEarlier = () => {
    const oldestMessage = messages[messages.length - 1];

    // Infinite scroll calls this on every reach of the top; one page in flight at a time. canSendNow() again,
    // not canLoadEarlier: the socket's readyState can change without a re-render.
    if (!canSendNow() || !selectedRoom?.hasMoreHistory || isLoadingEarlier || !oldestMessage) {
      return;
    }

    dispatch(mutation.setLoadingEarlierRoomSuccess(selectedRoomId));
    loadHistoryInRoom(chatSocket, selectedRoomId, profileId, getMessageTime(oldestMessage));
  };

  const handleGoBack = () => {
    // ChatPanel is a drawer screen: it stays mounted with no exit transition, so a quick second tap on back
    // still reaches this handler after we've left, and GO_BACK from the first route is handled by no navigator.
    if (!navigation.isFocused()) {
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Nothing to return to (e.g. ChatPanel restored as the only drawer route): go to the room list instead.
      navigation.navigate('TabNavigation', {screen: ROUTES.CHAT_ROOM_LIST});
    }
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
            disabledCall: disabledCall || waitingForChatLogin,
            onAudioCall: () => handleCall(false),
            onVideoCall: () => handleCall(true),
          }}
        />
      ) : (
        <HeaderBar onGoBack={() => handleGoBack()} title={selectedRoom?.name} />
      )}
      <GiftedChat
        messages={allMessages}
        loadEarlierMessagesProps={{
          isAvailable: canLoadEarlier,
          isLoading: isLoadingEarlier,
          isInfiniteScrollEnabled: true,
          onPress: handleLoadEarlier,
          label: translate('chat_message.load_earlier'),
          activityIndicatorColor: theme.colors.primary,
        }}
        isDayAnimationEnabled={false}
        placeholder={translate('chat.type.message')}
        messagesContainerStyle={styles.chatMainContainer}
        messageIdGenerator={() => generateHash()}
        keyboardAvoidingViewProps={{
          behavior: Platform.OS === 'ios' ? 'padding' : 'height',
          keyboardVerticalOffset: isOnlineMode
            ? insets.top + 64
            : insets.top + 64 + 40,
        }}
        textInputProps={{selectionColor: theme.colors.primary}}
        user={{_id: profile.chat_user_id}}
        colorScheme="light"
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
