/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Icon, withTheme} from 'react-native-elements';
import {
  GiftedChat,
  Bubble,
  Day,
  InputToolbar,
  Composer,
  Send,
} from 'react-native-gifted-chat';
import styles from '../../assets/styles';
import HeaderBar from '../../components/Common/HeaderBar';
import {getMessageList} from '../../store/message/actions';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import settings from '../../../config/settings';

const Message = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const messageHistory = useSelector((state) => state.message);
  const [messages, setMessages] = useState(messageHistory.messages);

  console.log('props = ', theme.colors);

  useEffect(() => {
    navigation.setOptions({tabBarVisible: false});
    return () => {
      navigation.setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  useEffect(() => {
    dispatch(getMessageList());
  }, [dispatch]);

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages),
    );
  };

  const renderDay = (chatProps) => {
    return (
      <Day
        {...chatProps}
        textStyle={styles.chatDay}
        dateFormat={settings.format.date}
      />
    );
  };

  const renderBubble = (chatProps) => {
    return (
      <Bubble
        {...chatProps}
        wrapperStyle={{
          left: styles.chatBubbleLeft,
          right: styles.chatBubbleRight,
        }}
      />
    );
  };

  const renderInputToolbar = (chatProps) => {
    return (
      <InputToolbar {...chatProps} containerStyle={styles.chatInputToolBar} />
    );
  };

  const renderComposer = (chatProps) => {
    return <Composer {...chatProps} textInputStyle={styles.chatComposer} />;
  };

  const renderSend = (chatProps) => {
    return (
      <Send
        {...chatProps}
        alwaysShowSend
        containerStyle={styles.chatSendButton}
        children={
          <Icon
            name="send"
            type="material"
            color={theme.colors.primary}
            size={28}
          />
        }
      />
    );
  };

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title="Dr. Magaret Huge"
      />
      <GiftedChat
        messages={messages}
        placeholder={translate('chat.type.message')}
        messagesContainerStyle={styles.chatMainContainer}
        minComposerHeight={45}
        user={{
          _id: 2,
        }}
        renderDay={renderDay}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        onSend={(newMessages) => onSend(newMessages)}
      />
    </>
  );
};

export default withTheme(Message);
