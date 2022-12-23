/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const assistiveTechnology = (state = initialState, action) => {
  switch (action.type) {
    case 'ASSISTIVE_TECHNOLOGIES_FETCH_SUCCEED':
      return Object.assign({}, state, {
        assistiveTechnologies: action.data,
      });
    default:
      return state;
  }
};
