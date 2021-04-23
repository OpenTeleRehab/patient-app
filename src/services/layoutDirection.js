/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getLayoutDirection = async () => {
  return await callAdminApi('/language');
};

export const LayoutDirection = {
  getLayoutDirection,
};
