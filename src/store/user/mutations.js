/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
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
  userLoginSuccess,
  userLoginFailure,
  userLogoutSuccess,
  userLogoutFailure,
};
