/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {ACTIONS} from '../../variables/constants';

const initialState = {
  isOnlineMode: true,
  hasActivity: false,
  hasGoal: false,
  hasAppointment: false,
  hasMessage: true,
  apiStage: '',
  apiURL: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {...state, ...action.payload?.indicator};
    case ACTIONS.INDICATOR_UPDATE_SUCCEED:
      return {...state, ...action.payload};
    default:
      return state;
  }
};
