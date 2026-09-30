/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {User} from '../../services/user';
import {mutation} from './mutations';
import {USER_ROLE} from '../../variables/constants';
import {callTherapistApi} from '../../utils/request';
import {disconnectChatSocket, resumeChatSocket} from '../../utils/rocketchat';

export const registerRequest = (
  dialCode,
  phone,
  hash,
  country,
  email,
  password,
  role
) => async (
  dispatch,
) => {
  dispatch(mutation.registerRequest());

  let response;

  if (role === USER_ROLE.HEALTH_WORKER) {
    const body = {email, password};
    response = await callTherapistApi('/auth/login', '', body, 'post');
  } else {
    response = await User.register(phone, hash, country, email);
  }

  if (response.success) {
    // Logging in as another account, stop receiving chat and calls for the current user
    disconnectChatSocket();

    dispatch(mutation.registerSuccess({
      dial_code: dialCode,
      phone: phone,
      countryCode: country,
      email: email,
      password: password,
      tempAccessToken: response?.data?.access_token,
      registerAs: role,
    }));
    return true;
  } else {
    dispatch(mutation.registerFailure());
    return false;
  }
};

export const clearRegister = () => async (dispatch) => {
  dispatch(mutation.clearRegister());
};

// Left the register flow without switching account, restore chat and calls for the current user
export const cancelRegister = () => async (dispatch, getState) => {
  if (getState().register?.registerAs) {
    dispatch(mutation.clearRegister());
    resumeChatSocket();
  }
};
