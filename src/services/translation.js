/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getTranslations = async () => {
  const options = {
    uri: '/translation/i18n/patient_app',
  };

  return await callApi(options, 'get', false, true);
};

export const Translation = {
  getTranslations,
};
