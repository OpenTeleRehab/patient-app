/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const goal = (state = initialState, action) => {
  switch (action.type) {
    case 'GOAL_FETCH_SUCCEED':
      return {...state, ...action.data};
    case 'GOAL_FETCH_FAILED':
    default:
      return state;
  }
};
