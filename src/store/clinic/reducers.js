/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const clinic = (state = initialState, action) => {
  switch (action.type) {
    case 'CLINIC_FETCH_SUCCEED':
      return Object.assign({}, state, {
        clinic: action.data,
      });
    default:
      return state;
  }
};
