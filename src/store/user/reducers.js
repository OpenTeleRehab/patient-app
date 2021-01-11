/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './state';

export const user = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SUCCEED':
      return action.data;
    case 'USER_LOGOUT_SUCCEED':
      return initialState;
    default:
      return state;
  }
};
