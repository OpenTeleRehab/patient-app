/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */

const userRegisterRequest = () => {
  return {
    type: 'USER_REGISTER_REQUESTED',
  };
};

const userRegisterSuccess = (data) => {
  return {
    type: 'USER_REGISTER_SUCCEED',
    data,
  };
};

const userRegisterFailure = () => {
  return {
    type: 'USER_REGISTER_FAILED',
  };
};

const userVerifyPhoneNumberRequest = () => {
  return {
    type: 'USER_VERIFY_PHONE_NUMBER_REQUESTED',
  };
};

const userVerifyPhoneNumberSuccess = (data) => {
  return {
    type: 'USER_VERIFY_PHONE_NUMBER_SUCCEED',
    data,
  };
};

const userVerifyPhoneNumberFailure = () => {
  return {
    type: 'USER_VERIFY_PHONE_NUMBER_FAILED',
  };
};

const userSetupPinNumberRequest = () => {
  return {
    type: 'USER_SETUP_PIN_NUMBER_REQUESTED',
  };
};

const userSetupPinNumberSuccess = (pin) => {
  return {
    type: 'USER_SETUP_PIN_NUMBER_SUCCEED',
    pin,
  };
};

const userSetupPinNumberFailure = () => {
  return {
    type: 'USER_SETUP_PIN_NUMBER_FAILED',
  };
};

const userLoginRequest = () => {
  return {
    type: 'USER_LOGIN_REQUESTED',
  };
};

const userLoginSuccess = (data, phone, pin) => {
  return {
    type: 'USER_LOGIN_SUCCEED',
    data,
    phone,
    pin,
  };
};

const userLoginFailure = () => {
  return {
    type: 'USER_LOGIN_FAILED',
  };
};

const userLogoutSuccess = () => {
  return {
    type: 'USER_LOGOUT_SUCCEED',
  };
};

const userLogoutFailure = () => {
  return {
    type: 'USER_LOGOUT_FAILED',
  };
};

const userComparePinNumberRequest = () => {
  return {
    type: 'USER_COMPARE_PIN_NUMBER_REQUESTED',
  };
};

const userComparePinNumberSuccess = () => {
  return {
    type: 'USER_COMPARE_PIN_NUMBER_SUCCEED',
  };
};

const userComparePinNumberFailure = () => {
  return {
    type: 'USER_COMPARE_PIN_NUMBER_FAILED',
  };
};

const userChangePinNumberRequest = () => {
  return {
    type: 'USER_CHANGE_PIN_NUMBER_REQUESTED',
  };
};

const userChangePinNumberSuccess = (data, phone) => {
  return {
    type: 'USER_CHANGE_PIN_NUMBER_SUCCEED',
    data,
    phone,
  };
};

const userChangePinNumberFailure = () => {
  return {
    type: 'USER_CHANGE_PIN_NUMBER_FAILED',
  };
};

const userSetInitialRouteNameSuccess = (data) => {
  return {
    type: 'USER_SET_INITIAL_ROUTE_NAME_SUCCEED',
    data,
  };
};

const userSetProfileSuccess = (data) => {
  return {
    type: 'USER_SET_PROFILE_SUCCEED',
    data,
  };
};

const updateProfileSuccess = (data) => {
  return {
    type: 'UPDATE_PROFILE_SUCCEED',
    data,
  };
};

const updateProfileFailure = () => {
  return {
    type: 'UPDATE_PROFILE_FAILED',
  };
};

const deleteProfileSuccess = () => {
  return {
    type: 'DELETE_PROFILE_SUCCEED',
  };
};

const deleteProfileFailure = () => {
  return {
    type: 'DELETE_PROFILE_FAILED',
  };
};

const getCallAccessTokenRequest = () => {
  return {
    type: 'GET_CALL_ACCESS_TOKEN_REQUEST',
  };
};

const getCallAccessTokenSuccess = () => {
  return {
    type: 'GET_CALL_ACCESS_TOKEN_SUCCESS',
  };
};

const getCallAccessTokenFailure = () => {
  return {
    type: 'GET_CALL_ACCESS_TOKEN_FAILED',
  };
};

const fetchTermOfServiceSuccess = (data) => {
  return {
    type: 'FETCH_TERM_OF_SERVICE_SUCCEED',
    data,
  };
};

const fetchTermOfServiceFailure = () => {
  return {
    type: 'FETCH_TERM_OF_SERVICE_FAILED',
  };
};

const fetchPrivacyPolicySuccess = (data) => {
  return {
    type: 'FETCH_PRIVACY_POLICY_SUCCEED',
    data,
  };
};

const fetchPrivacyPolicyFailure = () => {
  return {
    type: 'FETCH_PRIVACY_POLICY_FAILED',
  };
};

const acceptTermOfServiceRequest = () => {
  return {
    type: 'ACCEPT_TERM_OF_SERVICE_REQUESTED',
  };
};

const acceptTermOfServiceSuccess = (data) => {
  return {
    type: 'ACCEPT_TERM_OF_SERVICE_SUCCEED',
    data,
  };
};

const acceptTermOfServiceFailure = () => {
  return {
    type: 'ACCEPT_TERM_OF_SERVICE_FAILED',
  };
};

const acceptPrivacyPolicyRequest = () => {
  return {
    type: 'ACCEPT_TERM_OF_SERVICE_REQUESTED',
  };
};

const acceptPrivacyPolicySuccess = (data) => {
  return {
    type: 'ACCEPT_TERM_OF_SERVICE_SUCCEED',
    data,
  };
};

const acceptPrivacyPolicyFailure = () => {
  return {
    type: 'ACCEPT_TERM_OF_SERVICE_FAILED',
  };
};

const generateFakeAccessTokenSuccess = () => {
  return {
    type: 'GENERATE_FAKE_ACCESS_TOKEN_SUCCESS',
  };
};

const enableKidThemeRequest = () => {
  return {
    type: 'ENABLE_KID_THEME_REQUESTED',
  };
};

const enableKidThemeSuccess = (data) => {
  return {
    type: 'ENABLE_KID_THEME_SUCCEED',
    data,
  };
};

const enableKidThemeFailure = () => {
  return {
    type: 'ENABLE_KID_THEME_FAILED',
  };
};

const userCreateFirebaseTokenRequest = () => {
  return {
    type: 'USER_CREATE_FIREBASE_TOKEN_REQUEST',
  };
};

const userCreateFirebaseTokenSuccess = (data) => {
  return {
    type: 'USER_CREATE_FIREBASE_TOKEN_SUCCESS',
    data,
  };
};

const userCreateFirebaseTokenFailure = () => {
  return {
    type: 'USER_CREATE_FIREBASE_TOKEN_FAILED',
  };
};

export const mutation = {
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFailure,
  userVerifyPhoneNumberRequest,
  userVerifyPhoneNumberSuccess,
  userVerifyPhoneNumberFailure,
  userSetupPinNumberRequest,
  userSetupPinNumberSuccess,
  userSetupPinNumberFailure,
  userLoginRequest,
  userLoginSuccess,
  userLoginFailure,
  userLogoutSuccess,
  userLogoutFailure,
  userComparePinNumberRequest,
  userComparePinNumberSuccess,
  userComparePinNumberFailure,
  userChangePinNumberRequest,
  userChangePinNumberSuccess,
  userChangePinNumberFailure,
  userSetInitialRouteNameSuccess,
  userSetProfileSuccess,
  updateProfileSuccess,
  updateProfileFailure,
  deleteProfileSuccess,
  deleteProfileFailure,
  getCallAccessTokenRequest,
  getCallAccessTokenSuccess,
  getCallAccessTokenFailure,
  fetchTermOfServiceSuccess,
  fetchTermOfServiceFailure,
  acceptTermOfServiceRequest,
  acceptTermOfServiceSuccess,
  acceptTermOfServiceFailure,
  generateFakeAccessTokenSuccess,
  fetchPrivacyPolicySuccess,
  fetchPrivacyPolicyFailure,
  acceptPrivacyPolicySuccess,
  acceptPrivacyPolicyFailure,
  acceptPrivacyPolicyRequest,
  enableKidThemeRequest,
  enableKidThemeSuccess,
  enableKidThemeFailure,
  userCreateFirebaseTokenRequest,
  userCreateFirebaseTokenSuccess,
  userCreateFirebaseTokenFailure,
};
