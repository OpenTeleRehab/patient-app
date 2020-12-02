/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {REHYDRATE} from 'redux-persist';
import {ACTION_TYPE} from '../../utils/constants';

const initialState = {
  id: '',
  firstName: '',
  lastName: '',
  mobile: '',
  accessToken: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return action.payload?.patient || state;
    case ACTION_TYPE.PATIENT_LOGIN_SUCCEED:
      return action.payload;
    case ACTION_TYPE.PATIENT_LOGOUT_SUCCEED:
      return initialState;
    case ACTION_TYPE.PATIENT_LOGIN_FAILED:
    default:
      return state;
  }
};
