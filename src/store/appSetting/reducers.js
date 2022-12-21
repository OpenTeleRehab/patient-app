/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const appSettings = (state = initialState, action) => {
  switch (action.type) {
    case 'APP_SETTINGS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        appVersion: action.data,
      });
    case 'APP_SETTINGS_UPDATE_SKIP_VERSION':
      return Object.assign({}, state, {
        skipVersion: action.data,
      });
    default:
      return state;
  }
};
