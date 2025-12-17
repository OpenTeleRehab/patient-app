/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const province = (state = initialState, action) => {
  switch (action.type) {
    case 'PROVINCES_FETCH_SUCCEED':
      return Object.assign({}, state, {
        provinces: action.data,
      });
    default:
      return state;
  }
};
