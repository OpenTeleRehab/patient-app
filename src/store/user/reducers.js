/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './state';

export const user = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_REGISTER_SUCCEED': {
      return Object.assign({}, state, {
        phone: action.data.to,
      });
    }
    case 'USER_VERIFY_PHONE_NUMBER_SUCCEED': {
      return Object.assign({}, state, {
        otpCode: action.data.code,
      });
    }
    case 'USER_SETUP_PIN_NUMBER_SUCCEED': {
      return Object.assign({}, state, {
        timespan: action.data,
      });
    }
    case 'USER_LOGIN_SUCCEED': {
      return Object.assign({}, state, {
        profile: action.data.profile,
        accessToken: action.data.token,
        isFirstTimeLogin: false,
      });
    }
    case 'USER_LOGOUT_SUCCEED':
      return initialState;
    case 'USER_SET_INITIAL_ROUTE_NAME_SUCCEED': {
      return Object.assign({}, state, {
        initialRouteName: action.data,
      });
    }
    default:
      return state;
  }
};
