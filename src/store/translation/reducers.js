/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const translation = (state = initialState, action) => {
  switch (action.type) {
    case 'TRANSLATION_FETCH_SUCCEED': {
      return Object.assign({}, state, {
        language: action.language,
        rtl: action.rtl,
      });
    }
    default:
      return state;
  }
};
