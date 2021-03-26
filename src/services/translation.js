/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getTranslations = async (lang) => {
  return await callAdminApi('/translation/i18n/patient_app', {lang});
};

export const Translation = {
  getTranslations,
};
