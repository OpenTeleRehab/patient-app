/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const register = async (to) => {
  const options = {
    uri: '/register/send-code',
    body: {
      to,
    },
  };
  return await callApi(options, 'post');
};

const verifyPhoneNumber = async (to, code) => {
  const options = {
    uri: '/register/verify-code',
    body: {
      to,
      code,
    },
  };
  return await callApi(options, 'post');
};

const setupPinNumber = async (pin, phone, otp_code) => {
  const option = {
    uri: '/auth/add-new-pin',
    body: {
      pin,
      phone,
      otp_code,
    },
  };

  return await callApi(option, 'post');
};

const login = async (phone, pin) => {
  const option = {
    uri: '/auth/login',
    body: {
      phone,
      pin,
    },
  };

  return await callApi(option, 'post');
};

const logout = () => {
  return {};
};

export const User = {
  register,
  verifyPhoneNumber,
  setupPinNumber,
  login,
  logout,
};
