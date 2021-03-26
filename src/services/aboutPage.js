/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getAboutPage = async (lang) => {
  const body = {
    'url-segment': 'about-us',
    platform: 'patient_app',
    lang: lang,
  };

  return await callAdminApi('/page/about', body);
};

export const AboutPage = {
  getAboutPage,
};
