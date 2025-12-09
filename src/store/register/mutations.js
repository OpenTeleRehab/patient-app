/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */

const registerRequest = () => {
  return {
    type: 'REGISTER_REQUESTED',
  };
};

const registerSuccess = (data) => {
  return {
    type: 'REGISTER_SUCCEED',
    data,
  };
};

const registerFailure = () => {
  return {
    type: 'REGISTER_FAILED',
  };
};

const clearRegister = () => {
  return {
    type: 'CLEAR_REGISTER',
  };
};

export const mutation = {
  registerRequest,
  registerSuccess,
  registerFailure,
  clearRegister,
};
