/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const partnerLogo = (state = initialState, action) => {
  switch (action.type) {
    case 'PARTNER_LOGO_FETCH_SUCCEED':
      return Object.assign({}, state, {
        partnerLogo: action.data,
      });
    default:
      return state;
  }
};
