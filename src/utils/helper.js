/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Text} from 'react-native-elements';
import moment from 'moment';
import _ from 'lodash';
import settings from '../../config/settings';
import {CALL_STATUS} from '../variables/constants';
import styles from '../assets/styles';

export const formatDate = (date) => {
  return date ? moment(date).format(settings.format.date) : '';
};

export const isValidDateFormat = (date) => {
  if (date) {
    return moment(date, settings.format.date, true).isValid();
  }

  return false;
};

export const generateHash = (length = 17) => {
  let hashStr = '';
  const randomStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    hashStr += randomStr.charAt(Math.floor(Math.random() * randomStr.length));
  }

  return hashStr;
};

export const getUniqueId = (userId = 0) => {
  return _.uniqueId(`patient-${userId}_`);
};

export const getChatMessage = (message, userId = '', authToken = '') => {
  const {_id, rid, msg, _updatedAt, u, attachments, file} = message;
  let text = msg;
  let image = '';
  let video = '';
  if (file && attachments) {
    text = attachments[0].description;
    let baseUrl = settings.chatBaseURL;
    let authParams = `?rc_uid=${userId}&rc_token=${authToken}`;
    if (file.type.includes('video/')) {
      video = encodeURI(`${baseUrl}${attachments[0].video_url}${authParams}`);
    } else {
      image = encodeURI(`${baseUrl}${attachments[0].image_url}${authParams}`);
    }
  }

  return {
    _id,
    rid,
    text,
    image,
    video,
    createdAt: _updatedAt.$date ? new Date(_updatedAt.$date) : _updatedAt,
    user: {_id: u._id},
    received: true,
    pending: false,
    isVideoCall: msg !== '' && msg.includes('jitsi_call'),
  };
};

export const toMB = (bytes) => {
  return bytes / Math.pow(1024, 2);
};

export const isValidFileSize = (fileSize, maxFileSize = 0) => {
  let defaultMaxSize = settings.fileMaxUploadSize;
  if (maxFileSize > 0) {
    defaultMaxSize = maxFileSize;
  }
  return fileSize <= defaultMaxSize;
};

export const nEveryRow = (data, n) => {
  const result = [];
  let temp = [];

  for (let i = 0; i < data.length; ++i) {
    if (i > 0 && i % n === 0) {
      result.push(temp);
      temp = [];
    }
    temp.push(data[i]);
  }

  if (temp.length > 0) {
    while (temp.length !== n) {
      temp.push(null);
    }
    result.push(temp);
  }

  return result;
};

export const renderMsgText = (msg, translate) => {
  const text = msg.text;

  if (msg.isVideoCall) {
    if (
      text === CALL_STATUS.AUDIO_MISSED ||
      text === CALL_STATUS.VIDEO_MISSED
    ) {
      return <Text style={styles.textDanger}>{translate(text)}</Text>;
    } else if (
      [
        CALL_STATUS.AUDIO_STARTED,
        CALL_STATUS.VIDEO_STARTED,
        CALL_STATUS.ACCEPTED,
        CALL_STATUS.AUDIO_ENDED,
        CALL_STATUS.VIDEO_ENDED,
      ].includes(text)
    ) {
      return <Text>{translate(text)}</Text>;
    }
  }

  if ((msg.video && msg.video !== '') || (msg.image && msg.image !== '')) {
    return (
      <Text style={styles.textPrimary}>
        {translate('chat_attachment.title')}
      </Text>
    );
  }

  return <Text>{text}</Text>;
};
