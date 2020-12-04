/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {ACTIONS} from '../../variables/constants';

/* --------------------------
 * BEGIN: Indicator actions
 * ------------------------ */
export const indicatorUpdateSuccess = (payload) => {
  return {
    type: ACTIONS.INDICATOR_UPDATE_SUCCEED,
    payload,
  };
};
// END: Indicator actions

/* --------------------------
 * BEGIN: Patient actions
 * ------------------------ */
export const patientLoginSuccess = (payload) => {
  return {
    type: ACTIONS.PATIENT_LOGIN_SUCCEED,
    payload,
  };
};

export const patientLogoutSuccess = () => {
  return {
    type: ACTIONS.PATIENT_LOGOUT_SUCCEED,
  };
};

export const patientLoginFailure = () => {
  return {
    type: ACTIONS.PATIENT_LOGIN_FAILED,
  };
};
// END: Patient actions

/* --------------------------
 * BEGIN: Activity actions
 * ------------------------ */
export const activityFetchSuccess = (payload) => {
  return {
    type: ACTIONS.ACTIVITY_FETCH_SUCCEED,
    payload,
  };
};

export const activityFetchFailure = () => {
  return {
    type: ACTIONS.ACTIVITY_FETCH_FAILED,
  };
};
// END: Activity actions

/* --------------------------
 * BEGIN: Goal actions
 * ------------------------ */
export const goalFetchSuccess = (payload) => {
  return {
    type: ACTIONS.GOAL_FETCH_SUCCEED,
    payload,
  };
};

export const goalFetchFailure = () => {
  return {
    type: ACTIONS.GOAL_FETCH_FAILED,
  };
};
// END: Goal actions

/* --------------------------
 * BEGIN: Appointment actions
 * ------------------------ */
export const appointmentFetchSuccess = (payload) => {
  return {
    type: ACTIONS.APPOINTMENT_FETCH_SUCCEED,
    payload,
  };
};

export const appointmentFetchFailure = () => {
  return {
    type: ACTIONS.APPOINTMENT_FETCH_FAILED,
  };
};
// END: Appointment actions
