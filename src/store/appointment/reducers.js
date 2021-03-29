/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const appointment = (state = initialState, action) => {
  switch (action.type) {
    case 'APPOINTMENT_FETCH_REQUESTED':
      return Object.assign({}, state, {
        loading: true,
      });
    case 'APPOINTMENT_FETCH_SUCCEED':
      return Object.assign({}, state, {
        appointments: action.data,
        listInfo: action.info,
        loading: false,
      });
    case 'APPOINTMENT_FETCH_FAILED':
      return Object.assign({}, state, {
        loading: false,
      });
    default:
      return state;
  }
};
