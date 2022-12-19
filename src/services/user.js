/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi, callGlobalAdminApi} from '../utils/request';
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

const login = async (phone, pin, timezone, countryCode) => {
  const body = {phone, pin, timezone};
  return await callApi('/auth/login', '', body, 'post', false, {
    country: countryCode,
  });
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

const updateProfile = async (id, payload, accessToken) => {
  return await callApi(`/patient/${id}`, accessToken, {...payload}, 'put');
};

const deleteProfile = async (accessToken) => {
  return await callApi('/patient/profile/delete', accessToken, null, 'delete');
};

const getCallAccessToken = async (roomId, accessToken) => {
  const body = {room_id: roomId};

  return await callApi('/patient/get-call-access-token', accessToken, body);
};

const getTermOfService = async (lang) => {
  return await callGlobalAdminApi('/user-term-condition', {lang: lang});
};

const getPrivacyPolicy = async (lang) => {
  return await callGlobalAdminApi('/user-privacy-policy', {lang: lang});
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

const enableKidTheme = async (accessToken, payload) => {
  return await callApi(
    '/auth/enable-kid-theme',
    accessToken,
    {kid_theme: payload},
    'post',
  );
};

const createFirebaseToken = async (accessToken, payload) => {
  return await callApi(
    '/auth/create-firebase-token',
    accessToken,
    {firebase_token: payload},
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
  getCallAccessToken,
  getTermOfService,
  acceptTermOfService,
  getPrivacyPolicy,
  acceptPrivacyPolicy,
  enableKidTheme,
  createFirebaseToken,
};
