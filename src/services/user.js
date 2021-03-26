/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi, callAdminApi} from '../utils/request';

const register = async (to, hash) => {
  const body = {to, hash};
  return await callApi('/register/send-code', '', body, 'post');
};

const verifyPhoneNumber = async (to, code) => {
  const body = {to, code};
  return await callApi('/register/verify-code', '', body, 'post');
};

const setupPinNumber = async (
  pin,
  phone,
  otp_code,
  termOfServiceId,
  language,
) => {
  const body = {
    pin,
    phone,
    otp_code,
    language,
    term_and_condition_id: termOfServiceId,
  };
  return await callApi('/auth/add-new-pin', '', body, 'post');
};

const login = async (phone, pin) => {
  const body = {phone, pin};
  return await callApi('/auth/login', '', body, 'post');
};

const logout = async (accessToken) => {
  return await callApi('/auth/logout', accessToken);
};

const comparePinNumber = async (pin, accessToken) => {
  return await callApi('/auth/compare-pin', accessToken, {pin});
};

const changePinNumber = async (pin, accessToken) => {
  return await callApi('/auth/change-pin', accessToken, {pin}, 'post');
};

const updateProfile = async (id, payload) => {
  return await callApi(`/patient/${id}`, '', {...payload}, 'put');
};

const getTermOfService = async () => {
  return await callAdminApi('/user-term-condition');
};

const acceptTermOfService = async (id, accessToken) => {
  return await callApi(
    '/auth/accept-term-condition',
    accessToken,
    {term_and_condition_id: id},
    'post',
  );
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
