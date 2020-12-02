/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {ACTION_TYPE} from '../../utils/constants';

/* --------------------------
 * BEGIN: Indicator actions
 * ------------------------ */
export const indicatorUpdateSuccess = (payload) => {
  return {
    type: ACTION_TYPE.INDICATOR_UPDATE_SUCCEED,
    payload,
  };
};
// END: Indicator actions

/* --------------------------
 * BEGIN: Patient actions
 * ------------------------ */
export const patientLoginSuccess = (payload) => {
  return {
    type: ACTION_TYPE.PATIENT_LOGIN_SUCCEED,
    payload,
  };
};

export const patientLogoutSuccess = () => {
  return {
    type: ACTION_TYPE.PATIENT_LOGOUT_SUCCEED,
  };
};

export const patientLoginFailure = () => {
  return {
    type: ACTION_TYPE.PATIENT_LOGIN_FAILED,
  };
};
// END: Patient actions

/* --------------------------
 * BEGIN: Activity actions
 * ------------------------ */
export const activityFetchSuccess = (payload) => {
  return {
    type: ACTION_TYPE.ACTIVITY_FETCH_SUCCEED,
    payload,
  };
};

export const activityLoginFailure = () => {
  return {
    type: ACTION_TYPE.ACTIVITY_FETCH_FAILED,
  };
};
// END: Activity actions
