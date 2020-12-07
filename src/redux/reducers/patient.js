/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {ACTIONS} from '../../variables/constants';

const initialState = {
  id: '',
  firstName: '',
  lastName: '',
  mobile: '',
  accessToken: '',
  isFirstTimeLogin: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return action.payload?.patient || state;
    case ACTIONS.PATIENT_LOGIN_SUCCEED:
      return action.payload;
    case ACTIONS.PATIENT_LOGOUT_SUCCEED:
      return initialState;
    case ACTIONS.PATIENT_LOGIN_FAILED:
    default:
      return state;
  }
};
