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
