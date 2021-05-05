/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {MessageText} from 'react-native-gifted-chat';
import {CALL_STATUS} from '../../../variables/constants';
import styles from '../../../assets/styles';

const ChatTypeText = ({chatData, translate}) => {
  const {text, isVideoCall} = chatData.currentMessage;
  let msgText = text;
  let textStyle = styles.textDefault;
  if (isVideoCall) {
    if (
      text === CALL_STATUS.AUDIO_MISSED ||
      text === CALL_STATUS.VIDEO_MISSED
    ) {
      msgText = translate(text);
      textStyle = styles.textDanger;
    } else if (
      [
        CALL_STATUS.AUDIO_STARTED,
        CALL_STATUS.VIDEO_STARTED,
        CALL_STATUS.ACCEPTED,
      ].includes(text)
    ) {
      msgText = translate(text);
    } else if (
      text === CALL_STATUS.AUDIO_ENDED ||
      text === CALL_STATUS.VIDEO_ENDED
    ) {
      msgText = translate(text);
    }
  }
  chatData.currentMessage.text = msgText;

  return <MessageText {...chatData} textStyle={{left: textStyle}} />;
};

export default ChatTypeText;
