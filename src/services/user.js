/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi, callAdminApi} from '../utils/request';
import {getCountryCodeFromStore} from '../utils/country';

const register = async (to, hash, country, email) => {
  const body = {to, hash, email};
  return await callApi('/register/send-code', '', body, 'post', false, {
    country,
  });
};

const verifyPhoneNumber = async (to, code, email) => {
  const body = {to, code, email};
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

const login = async (phone, pin, countryCode) => {
  const body = {phone, pin};
  return await callApi('/auth/login', '', body, 'post', false, {countryCode});
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

const getTermOfService = async (lang) => {
  return await callAdminApi('/user-term-condition', {lang: lang});
};

const getPrivacyPolicy = async (lang) => {
  return await callAdminApi('/user-privacy-policy', {lang: lang});
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
