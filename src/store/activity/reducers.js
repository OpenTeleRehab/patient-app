/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const activity = (state = initialState, action) => {
  switch (action.type) {
    case 'ACTIVITY_FETCH_SUCCEED':
      return {...state, ...action.data};
    case 'ACTIVITY_FETCH_FAILED':
    default:
      return state;
  }
};
