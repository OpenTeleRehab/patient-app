/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {MessageText} from 'react-native-gifted-chat';
import {CALL_MISSED_STATUSES, CALL_STATUS} from '../../../variables/constants';
import styles from '../../../assets/styles';

const ChatTypeText = ({chatData, translate}) => {
  const {text, isVideoCall} = chatData.currentMessage;
  let msgText = text;
  let textStyle = styles.textDefault;
  if (isVideoCall) {
    if ([...CALL_MISSED_STATUSES, CALL_STATUS.BUSY].includes(text)) {
      msgText = translate(text);
      textStyle = styles.textDanger;
    } else {
      msgText = translate(text);
    }
  }
  // Render a copy: writing msgText back into currentMessage replaced the stored call code (jitsi_call_...) with
  // its translation, so the next render no longer recognised it (missed calls lost their red) and the
  // translated text was saved with the room.
  return (
    <MessageText
      {...chatData}
      currentMessage={{...chatData.currentMessage, text: msgText}}
      textStyle={{left: textStyle}}
    />
  );
};

export default ChatTypeText;
