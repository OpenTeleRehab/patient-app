/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getLanguages = async () => {
  return await callAdminApi('/language');
};
const getLanguageById = async (lang) => {
  return await callAdminApi(`/language/by-id/${lang}`);
};

export const Language = {
  getLanguages,
  getLanguageById,
};
