/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const country = (state = initialState, action) => {
  switch (action.type) {
    case 'COUNTRY_FETCH_SUCCEED':
      return Object.assign({}, state, {
        countries: action.data,
        userCountryCode: action.userCountryCode,
      });
    default:
      return state;
  }
};
