/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const indicator = (state = initialState, action) => {
  switch (action.type) {
    case 'INDICATOR_UPDATE_SUCCEED':
      return {...state, ...action.data};
    default:
      return state;
  }
};
