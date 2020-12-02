/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {ACTION_TYPE} from '../../utils/constants';

const initialState = {
  isOnlineMode: true,
  apiStage: '',
  apiURL: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {...state, ...action.payload?.indicator};
    case ACTION_TYPE.INDICATOR_UPDATE_SUCCEED:
      return {...state, ...action.payload};
    default:
      return state;
  }
};
