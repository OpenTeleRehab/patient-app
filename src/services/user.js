/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi, callAdminApi} from '../utils/request';
import {getCountryCodeFromStore} from '../utils/country';

const register = async (to, hash, country) => {
  const body = {to, hash};
  return await callApi('/register/send-code', '', body, 'post', false, {
    country,
  });
};

const verifyPhoneNumber = async (to, code) => {
  const body = {to, code};
  return await callApi('/register/verify-code', '', body, 'post', false, {
    country: getCountryCodeFromStore(),
  });
};

const setupPinNumber = async (
  pin,
  phone,
  otp_code,
  termOfServiceId,
  privacyPolicyId,
  language,
) => {
  const body = {
    pin,
    phone,
    otp_code,
    language,
    term_and_condition_id: termOfServiceId,
    privacy_and_policy_id: privacyPolicyId,
  };
  return await callApi('/auth/add-new-pin', '', body, 'post', false, {
    country: getCountryCodeFromStore(),
  });
};

const login = async (phone, pin, country) => {
  const body = {phone, pin};
  return await callApi('/auth/login', '', body, 'post', false, {country});
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

const deleteProfile = async (accessToken) => {
  return await callApi('/patient/profile/delete', accessToken, null, 'delete');
};

const getTermOfService = async () => {
  return await callAdminApi('/user-term-condition');
};

const getPrivacyPolicy = async () => {
  return await callAdminApi('/user-privacy-policy');
};

const acceptTermOfService = async (id, accessToken) => {
  return await callApi(
    '/auth/accept-term-condition',
    accessToken,
    {term_and_condition_id: id},
    'post',
  );
};

const acceptPrivacyPolicy = async (id, accessToken) => {
  return await callApi(
    '/auth/accept-privacy-policy',
    accessToken,
    {privacy_and_policy_id: id},
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
  deleteProfile,
  getTermOfService,
  acceptTermOfService,
  getPrivacyPolicy,
  acceptPrivacyPolicy,
};
