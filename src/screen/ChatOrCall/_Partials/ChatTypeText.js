/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {MessageText} from 'react-native-gifted-chat';
import {CALL_STATUS} from '../../../variables/constants';
import styles from '../../../assets/styles';

const ChatTypeImage = ({chatData, translate}) => {
  const {text, isVideoCall} = chatData.currentMessage;
  let msgText = text;
  let textStyle = styles.textDefault;
  if (isVideoCall) {
    if (text === CALL_STATUS.MISSED) {
      msgText = translate('video_call_missed');
      textStyle = styles.textDanger;
    } else if ([CALL_STATUS.STARTED, CALL_STATUS.ACCEPTED].includes(text)) {
      msgText = translate('video_call_started');
    } else if (text === CALL_STATUS.ENDED) {
      msgText = translate('video_call_ended');
    }
  }
  chatData.currentMessage.text = msgText;

  return <MessageText {...chatData} textStyle={{left: textStyle}} />;
};

export default ChatTypeImage;
