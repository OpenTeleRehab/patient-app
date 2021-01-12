/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */

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

export const mutation = {
  userRegisterSuccess,
  userRegisterFailure,
  userVerifyPhoneNumberSuccess,
  userVerifyPhoneNumberFailure,
  userLoginSuccess,
  userLoginFailure,
  userLogoutSuccess,
  userLogoutFailure,
};
