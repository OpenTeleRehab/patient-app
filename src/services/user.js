/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const register = async (to, hash) => {
  const options = {
    uri: '/register/send-code',
    body: {
      to,
      hash,
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

const logout = async (accessToken) => {
  const options = {
    uri: '/auth/logout',
    accessToken,
  };

  return await callApi(options);
};

const comparePinNumber = async (pin, accessToken) => {
  const options = {
    uri: '/auth/compare-pin',
    accessToken,
    body: {
      pin,
    },
  };

  return await callApi(options);
};

const changePinNumber = async (pin, accessToken) => {
  const options = {
    uri: '/auth/change-pin',
    accessToken,
    body: {
      pin,
    },
  };

  return await callApi(options, 'post');
};

const updateProfile = async (id, payload) => {
  const options = {
    uri: `/patient/${id}`,
    body: {
      ...payload,
    },
  };

  return await callApi(options, 'put');
};

const getTermOfService = async () => {
  const options = {
    uri: '/user-term-condition',
  };

  return await callApi(options, 'get', false, true);
};

const acceptTermOfService = async (id, accessToken) => {
  const options = {
    uri: '/auth/accept-term-condition',
    accessToken,
    body: {
      term_and_condition_id: id,
    },
  };

  return await callApi(options, 'post');
};

export const User = {
  register,
  verifyPhoneNumber,
  setupPinNumber,
  login,
  logout,
  comparePinNumber,
  changePinNumber,
  updateProfile,
  getTermOfService,
  acceptTermOfService,
};
