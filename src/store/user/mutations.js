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

const userSetupPinNumberSuccess = () => {
  return {
    type: 'USER_SETUP_PIN_NUMBER_SUCCEED',
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

const userLoginSuccess = (data) => {
  return {
    type: 'USER_LOGIN_SUCCEED',
    data,
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

const userChangePinNumberSuccess = (data) => {
  return {
    type: 'USER_CHANGE_PIN_NUMBER_SUCCEED',
    data,
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
};
