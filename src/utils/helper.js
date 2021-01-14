/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import moment from 'moment';
import settings from '../../config/settings';

export const formatDate = (date) => {
  if (date) {
    return moment(date).format(settings.format.date);
  }

  return '';
};

export const isValidDateFormat = (date) => {
  if (date) {
    return moment(date, settings.format.date, true).isValid();
  }

  return false;
};
