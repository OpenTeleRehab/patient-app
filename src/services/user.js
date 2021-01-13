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

const setupPinNumber = async (pin, opt_code) => {
  const option = {
    uri: '/auth/add-new-pin',
    body: {
      pin,
      opt_code,
    },
  };

  return await callApi(option, 'post');
};

const login = async () => {
  return {
    id: 1,
    firstName: 'Luke',
    lastName: 'Cameron',
    phone: '012222333',
    accessToken: 'CIkc4AwU5c5mC7h8vcpdRqV99w6nS5nm',
    isFirstTimeLogin: false,
  };
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
