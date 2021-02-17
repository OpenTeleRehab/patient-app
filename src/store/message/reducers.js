/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const message = (state = initialState, action) => {
  switch (action.type) {
    case 'MESSAGE_FETCH_SUCCEED':
      return state;
    case 'MESSAGE_FETCH_REQUESTED':
      return Object.assign({}, state, {
        isLoading: true,
      });
    case 'MESSAGE_FETCH_FAILED':
      return Object.assign({}, state, {
        isLoading: false,
      });
    default:
      return state;
  }
};
