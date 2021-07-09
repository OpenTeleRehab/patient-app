/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Actions, Composer, InputToolbar, Send} from 'react-native-gifted-chat';
import styles from '../../../assets/styles';
import {Icon} from 'react-native-elements';

const ChatToolbar = ({chatData, theme, translate, onShowPicker}) => {
  return (
    <InputToolbar
      {...chatData}
      renderComposer={() => (
        <Composer
          {...chatData}
          textInputStyle={styles.chatComposer}
          placeholder={translate('placeholder.type.message')}
        />
      )}
      renderActions={() => (
        <Actions
          {...chatData}
          icon={() => (
            <Icon
              name="paperclip"
              size={26}
              type="feather"
              color={theme.colors.grey3}
              onPress={() => onShowPicker(true)}
            />
          )}
          containerStyle={styles.chatAttachment}
        />
      )}
      renderSend={() => (
        <Send
          {...chatData}
          containerStyle={styles.chatSendButton}
          children={
            <Icon
              name="send"
              type="material"
              color={theme.colors.primary}
              size={26}
            />
          }
        />
      )}
    />
  );
};

export default ChatToolbar;
