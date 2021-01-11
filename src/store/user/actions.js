/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {User} from '../../services/user';
import {mutation} from './mutations';

export const userLoginRequest = () => async (dispatch) => {
  const data = await User.login();
  if (data) {
    dispatch(mutation.userLoginSuccess(data));
  } else {
    dispatch(mutation.userLoginFailure());
  }
};

export const userLogoutRequest = () => async (dispatch) => {
  const data = await User.logout();
  if (data) {
    dispatch(mutation.userLogoutSuccess());
  } else {
    dispatch(mutation.userLogoutFailure());
  }
};
