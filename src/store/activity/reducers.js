/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {initialState} from './states';

export const activity = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {...state, ...action.data?.activity};
    case 'ACTIVITY_FETCH_SUCCEED':
      return {...state, ...action.data};
    default:
      return state;
  }
};
