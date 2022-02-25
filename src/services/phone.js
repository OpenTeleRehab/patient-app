/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callPhoneApi} from '../utils/request';

const getPhone = async (payload) => {
  return await callPhoneApi('/get-phone', payload);
};

export const Phone = {
  getPhone,
};
