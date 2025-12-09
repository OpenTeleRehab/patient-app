/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './state';

export const register = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_REQUESTED':
    case 'REGISTER_SUCCEED': {
      return Object.assign({}, state, {
        ...action.data,
      });
    }
    case 'REGISTER_FAILED':
    case 'CLEAR_REGISTER': {
      return {};
    }
    default:
      return state;
  }
};
