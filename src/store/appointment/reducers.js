/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const appointment = (state = initialState, action) => {
  switch (action.type) {
    case 'APPOINTMENT_FETCH_SUCCEED':
      return action.data;
    default:
      return state;
  }
};
