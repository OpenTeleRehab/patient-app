/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const staticPage = (state = initialState, action) => {
  switch (action.type) {
    case 'ABOUT_PAGE_FETCH_SUCCEED':
      return Object.assign({}, state, {
        aboutPage: action.data,
      });
    case 'FAQ_PAGE_FETCH_SUCCEED':
      return Object.assign({}, state, {
        faqPage: action.data,
      });
    default:
      return state;
  }
};
