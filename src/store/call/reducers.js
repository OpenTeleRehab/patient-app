/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const call = (state = initialState, action) => {
  switch (action.type) {
    case 'ACCEPTED': {
      return Object.assign({}, state, {
        accepted: action.data,
      });
    }
    case 'REJECTED': {
      return Object.assign({}, state, {
        rejected: action.data,
      });
    }
    default:
      return state;
  }
};
