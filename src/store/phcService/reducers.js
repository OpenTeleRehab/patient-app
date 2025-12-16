/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const phcService = (state = initialState, action) => {
  switch (action.type) {
    case 'PHC_SERVICES_FETCH_SUCCEED':
      return Object.assign({}, state, {
        phcServices: action.data,
      });
    case 'PHC_WORKERS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        phcWorkers: action.data,
      });
    default:
      return state;
  }
};
