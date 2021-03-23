/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const aboutPage = (state = initialState, action) => {
  switch (action.type) {
    case 'ABOUT_PAGE_FETCH_SUCCEED':
      return Object.assign({}, state, {
        aboutPage: action.data,
      });
    default:
      return state;
  }
};
