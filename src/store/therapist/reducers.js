/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const therapist = (state = initialState, action) => {
  switch (action.type) {
    case 'THERAPIST_FETCH_SUCCEED':
      return Object.assign({}, state, {
        therapists: action.data,
      });
    default:
      return state;
  }
};
