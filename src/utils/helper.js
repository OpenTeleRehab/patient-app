/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import moment from 'moment';
import _ from 'lodash';
import settings from '../../config/settings';

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
  const {_id, rid, msg, _updatedAt, u, unread, attachments, file} = message;
  let text = msg;
  let image = '';
  let video = '';
  if (file && attachments) {
    text = attachments[0].description;
    let baseUrl = settings.chatBaseUrl;
    let authParams = `?rc_uid=${userId}&rc_token=${authToken}`;
    if (file.type === 'video/mp4') {
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
    unread: !!unread,
  };
};
