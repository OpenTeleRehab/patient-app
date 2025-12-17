/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const transfer = (state = initialState, action) => {
  switch (action.type) {
    case 'TRANSFERS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        transfers: action.data,
      });
    default:
      return state;
  }
};
