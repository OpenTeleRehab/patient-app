/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const achievement = (state = initialState, action) => {
  switch (action.type) {
    case 'ACHIEVEMENT_FETCH_SUCCEED':
      return Object.assign({}, state, {
        achievements: action.data,
      });
    default:
      return state;
  }
};
