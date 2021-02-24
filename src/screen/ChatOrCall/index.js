/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useState} from 'react';
import {Text, withTheme} from 'react-native-elements';
import {GiftedChat} from 'react-native-gifted-chat';
import {useIsFocused} from '@react-navigation/native';
import styles from '../../assets/styles';
import HeaderBar from '../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import settings from '../../../config/settings';
import {generateHash} from '../../utils/helper';
import {Platform, View} from 'react-native';
import {CHAT_USER_STATUS} from '../../variables/constants';
import RocketchatContext from '../../context/RocketchatContext';
import {sendNewMessage} from '../../utils/rocketchat';
import {updateIndicatorList} from '../../store/indicator/actions';
import MediaPicker from '../../components/MediaPicker';
import {postAttachmentMessage} from '../../store/rocketchat/actions';
import ChatContainer from './_Partials/ChatContainer';
import ChatToolbar from './_Partials/ChatToolbar';

const ChatOrCall = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const localize = useSelector((state) => state.localize);
  const {messages, selectedRoom} = useSelector((state) => state.rocketchat);
  const {isOnChatScreen, hasUnreadMessage} = useSelector(
    (state) => state.indicator,
  );
  const profile = useSelector((state) => state.user.profile);
  const translate = getTranslate(localize);
  const [allMessages, setAllMessages] = useState(messages);
  const [showPicker, setShowPicker] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    navigation.setOptions({tabBarVisible: false});
    setAllMessages(messages);
    return () => {
      navigation.setOptions({tabBarVisible: true});
    };
  }, [dispatch, navigation, messages]);

  useEffect(() => {
    if (isOnChatScreen !== isFocused) {
      dispatch(updateIndicatorList({isOnChatScreen: isFocused}));
    }
    if (isFocused && hasUnreadMessage) {
      // markMessagesAsRead(chatSocket, selectedRoom.rid, profile.id);
      dispatch(updateIndicatorList({hasUnreadMessage: false}));
    }
  }, [dispatch, isFocused, isOnChatScreen, hasUnreadMessage]);

  const onSend = (newMessage = []) => {
    newMessage[0].pending = true;
    setAllMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage),
    );
    newMessage[0].rid = selectedRoom.rid;
    sendNewMessage(chatSocket, newMessage[0], profile.id);
  };

  const onSendAttachment = (caption, file, type) => {
    const newMessage = {
      _id: generateHash(),
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
    dispatch(postAttachmentMessage(selectedRoom.rid, attachment));
  };

  const renderMessage = (chatProps) => {
    return (
      <ChatContainer chatData={chatProps} theme={theme} translate={translate} />
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

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={selectedRoom.name}
      />
      <GiftedChat
        isTyping={true}
        messages={allMessages}
        placeholder={translate('chat.type.message')}
        messagesContainerStyle={styles.chatMainContainer}
        minComposerHeight={45}
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
          allMediaText={translate('all_medias')}
          allVideoText={translate('all_videos')}
          emptyText={translate('no_medias')}
          captionPlaceholder={translate('add_a_caption')}
          sizeErrorText={translate('common.error_message_invalid_file_size', {
            size: settings.fileMaxUploadSize,
          })}
          buttonOKLabel={translate('common.ok')}
        />
      )}
    </>
  );
};

export default withTheme(ChatOrCall);
