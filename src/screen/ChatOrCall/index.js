/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useState} from 'react';
import {Icon, Text, withTheme} from 'react-native-elements';
import {
  Actions,
  Message,
  Bubble,
  Composer,
  Day,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import {useIsFocused} from '@react-navigation/native';
import styles from '../../assets/styles';
import HeaderBar from '../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import settings from '../../../config/settings';
import {generateHash} from '../../utils/helper';
import {View} from 'react-native';
import {CHAT_USER_STATUS} from '../../variables/constants';
import RocketchatContext from '../../context/RocketchatContext';
import {sendNewMessage} from '../../utils/rocketchat';
import {updateIndicatorList} from '../../store/indicator/actions';

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

  const renderMessage = (chatProps) => {
    return (
      <Message
        {...chatProps}
        renderBubble={() => (
          <Bubble
            {...chatProps}
            wrapperStyle={{
              left: styles.chatBubbleLeft,
              right: styles.chatBubbleRight,
            }}
          />
        )}
        renderDay={() => (
          <Day
            {...chatProps}
            textStyle={styles.chatDay}
            dateFormat={settings.format.date}
          />
        )}
        renderAvatar={null}
      />
    );
  };

  const renderTherapistNotOnline = () => {
    if (selectedRoom.u.status !== CHAT_USER_STATUS.ONLINE) {
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
      <InputToolbar
        {...chatProps}
        containerStyle={styles.chatInputToolBar}
        renderComposer={() => (
          <Composer
            {...chatProps}
            textInputStyle={styles.chatComposer}
            placeholder={translate('placeholder.type.message')}
          />
        )}
        renderActions={() => (
          <Actions
            {...chatProps}
            icon={() => (
              <Icon
                name="paperclip"
                size={28}
                type="feather"
                color={theme.colors.grey3}
              />
            )}
            containerStyle={styles.chatAttachment}
            onPressActionButton={() => null}
          />
        )}
        renderSend={() => (
          <Send
            {...chatProps}
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
        )}
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
        renderFooter={renderTherapistNotOnline}
        onSend={(newMessage) => onSend(newMessage)}
      />
    </>
  );
};

export default withTheme(ChatOrCall);
