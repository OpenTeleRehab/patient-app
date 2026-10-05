/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import moment from 'moment';
import _ from 'lodash';
import settings from '../../config/settings';
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

// Rocket.Chat dates are {$date: ms} over the socket and ISO strings over REST; local messages use createdAt.
export const getMessageTime = (message) => {
  const value = message?.ts ?? message?.createdAt;
  const time = new Date(value?.$date ?? value ?? 0).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const getChatMessage = (message, userId = '', authToken = '') => {
  const {_id, rid, msg, ts, _updatedAt, u, attachments, file, editedAt} = message;
  // ts is when it was sent; _updatedAt moves on every edit (e.g. each call status change).
  const sentAt = ts ?? _updatedAt;
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
    createdAt: sentAt?.$date ? new Date(sentAt.$date) : sentAt,
    user: {_id: u._id},
    received: true,
    pending: false,
    isVideoCall: msg.startsWith('jitsi_call'),
    isEdited: !!editedAt,
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
