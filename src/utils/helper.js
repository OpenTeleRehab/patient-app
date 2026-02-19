/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Text} from 'react-native-elements';
import moment from 'moment';
import _ from 'lodash';
import settings from '../../config/settings';
import styles from '../assets/styles';
import store from '../store';

export const formatDate = (date) => {
  return date ? moment(date).format(settings.format.date) : '';
};

export const formatTime = (time) => {
  return time ? moment(time).format(settings.format.time) : '';
};

export const isValidDateFormat = (date) => {
  if (date) {
    return moment(date, settings.format.date, true).isValid();
  }

  return false;
};

export const isPhcWorker = (type) => {
  if (!type) {
    return false;
  }
  return type === 'phc_worker';
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
    let baseUrl = store.getState().phone.chatBaseURL;
    let authParams = `?rc_uid=${userId}&rc_token=${authToken}`;

    if (file.type.startsWith('image/')) {
      image = encodeURI(`${baseUrl}${attachments[0].image_url}${authParams}`);
    }
    if (file.type.startsWith('video/')) {
      video = encodeURI(`${baseUrl}${attachments[0].video_url}${authParams}`);
    }
    if (file.type === 'application/octet-stream') {
      video = encodeURI(`${baseUrl}${attachments[0].title_link}${authParams}`);
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
    isVideoCall: msg.startsWith('jitsi_call'),
  };
};

export const getParticipantName = (participant) => {
  const parts = participant?.identity?.split('###');
  return parts?.[2] ?? '';
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

export const renderLastMessageText = (lastMessage, translate) => {
  if (!lastMessage) return null;

  const msg = lastMessage.msg || lastMessage.text;
  const isAttachment = lastMessage.file || lastMessage.image;

  if (msg) {
    if (msg.startsWith('jitsi_call')) {
      const isDanger = msg.endsWith('_missed') || msg.endsWith('_busy');

      return (
        <Text style={isDanger ? styles.textDanger : undefined}>
          {translate(msg)}
        </Text>
      );
    }

    return <Text>{msg}</Text>;
  }

  if (isAttachment) {
    return (
      <Text style={styles.textPrimary}>
        {translate('chat_attachment.title')}
      </Text>
    );
  }
};
