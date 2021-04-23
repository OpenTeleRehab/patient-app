/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const profession = (state = initialState, action) => {
  switch (action.type) {
    case 'PROFESSION_FETCH_SUCCEED':
      return Object.assign({}, state, {
        professions: action.data,
      });
    default:
      return state;
  }
};
