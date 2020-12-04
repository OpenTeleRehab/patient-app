/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {ACTIONS} from '../../variables/constants';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {...state, ...action.payload?.goal};
    case ACTIONS.GOAL_FETCH_SUCCEED:
      return {...state, ...action.payload};
    case ACTIONS.GOAL_FETCH_FAILED:
    default:
      return state;
  }
};
