/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {User} from '../../services/user';
import {mutation} from './mutations';

export const registerRequest = (to) => async (dispatch) => {
  const data = await User.register(to);
  if (data.success) {
    dispatch(mutation.userRegisterSuccess({to}));
    return true;
  } else {
    dispatch(mutation.userRegisterFailure());
    return false;
  }
};

export const verifyPhoneNumberRequest = (to, code) => async (dispatch) => {
  const data = await User.verifyPhoneNumber(to, code);
  if (data.success) {
    dispatch(mutation.userVerifyPhoneNumberSuccess({code}));
    return true;
  } else {
    dispatch(mutation.userVerifyPhoneNumberFailure());
    return false;
  }
};

export const loginRequest = () => async (dispatch) => {
  const data = await User.login();
  if (data) {
    dispatch(mutation.userLoginSuccess(data));
  } else {
    dispatch(mutation.userLoginFailure());
  }
};

export const logoutRequest = () => async (dispatch) => {
  const data = await User.logout();
  if (data) {
    dispatch(mutation.userLogoutSuccess());
  } else {
    dispatch(mutation.userLogoutFailure());
  }
};
