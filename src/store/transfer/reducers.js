/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const transfer = (state = initialState, action) => {
  switch (action.type) {
    case 'TRANSFERS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        transfers: action.data,
      });
    case 'CREATE_TRANSFER_PATIENT_REQUESTED':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_TRANSFER_PATIENT_SUCCEED':
    case 'CREATE_TRANSFER_PATIENT_FAILED':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
