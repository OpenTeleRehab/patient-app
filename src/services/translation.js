/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callGlobalAdminApi} from '../utils/request';

const getTranslations = async (lang) => {
  return await callGlobalAdminApi('/translation/i18n/patient_app', {lang});
};

export const Translation = {
  getTranslations,
};
