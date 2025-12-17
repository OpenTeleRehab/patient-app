/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const region = (state = initialState, action) => {
  switch (action.type) {
    case 'REGIONS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        regions: action.data,
      });
    default:
      return state;
  }
};
