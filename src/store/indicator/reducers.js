/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {initialState} from './states';

export const indicator = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {...state, ...action.data?.indicator};
    case 'INDICATOR_UPDATE_SUCCEED':
      return {...state, ...action.data};
    default:
      return state;
  }
};
