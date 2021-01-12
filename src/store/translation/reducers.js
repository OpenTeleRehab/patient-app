/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {initialState} from './states';

export const translation = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {...state, ...action.data?.translation};
    default:
      return state;
  }
};
