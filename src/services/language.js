/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callGlobalAdminApi} from '../utils/request';

const getLanguages = async () => {
  return await callGlobalAdminApi('/language');
};

export const Language = {
  getLanguages,
};
