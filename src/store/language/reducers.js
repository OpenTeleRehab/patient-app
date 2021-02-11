/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const language = (state = initialState, action) => {
  switch (action.type) {
    case 'LANGUAGE_FETCH_SUCCEED':
      return Object.assign({}, state, {
        languages: action.data,
      });
    default:
      return state;
  }
};
