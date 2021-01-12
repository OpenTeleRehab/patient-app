/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {initialState} from './state';

export const user = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return action.data?.user || state;
    case 'USER_REGISTER_SUCCEED': {
      return Object.assign({}, state, {
        phone: action.data.to,
      });
    }
    case 'USER_VERIFY_PHONE_NUMBER_SUCCEED': {
      return Object.assign({}, state, {
        optCode: action.data.code,
      });
    }
    case 'USER_LOGIN_SUCCEED':
      return action.data;
    case 'USER_LOGOUT_SUCCEED':
      return initialState;
    default:
      return state;
  }
};
