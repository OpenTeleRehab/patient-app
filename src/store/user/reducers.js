/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './state';
import {ROUTES} from '../../variables/constants';

export const user = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_REGISTER_REQUESTED':
    case 'USER_VERIFY_PHONE_NUMBER_REQUESTED':
    case 'USER_SETUP_PIN_NUMBER_REQUESTED':
    case 'USER_LOGIN_REQUESTED':
    case 'USER_COMPARE_PIN_NUMBER_REQUESTED':
    case 'USER_CHANGE_PIN_NUMBER_REQUESTED': {
      return Object.assign({}, state, {
        isLoading: true,
      });
    }
    case 'USER_REGISTER_SUCCEED': {
      return Object.assign({}, state, {
        phone: action.data.to,
        isLoading: false,
      });
    }
    case 'USER_VERIFY_PHONE_NUMBER_SUCCEED': {
      return Object.assign({}, state, {
        otpCode: action.data.code,
        isLoading: false,
      });
    }
    case 'USER_CHANGE_PIN_NUMBER_SUCCEED':
    case 'USER_LOGIN_SUCCEED': {
      return Object.assign({}, state, {
        profile: action.data.profile,
        accessToken: action.data.token,
        initialRouteName: ROUTES.LOGIN,
        isLoading: false,
      });
    }
    case 'USER_LOGOUT_SUCCEED': {
      return Object.assign({}, state, {
        accessToken: '',
        profile: {},
        initialRouteName: ROUTES.LOGIN,
      });
    }
    case 'USER_SET_INITIAL_ROUTE_NAME_SUCCEED': {
      return Object.assign({}, state, {
        initialRouteName: action.data,
      });
    }
    case 'USER_SET_PROFILE_SUCCEED': {
      return Object.assign({}, state, {
        profile: action.data.profile,
        accessToken: action.data.token,
      });
    }
    case 'UPDATE_PROFILE_SUCCEED':
      return Object.assign({}, state, {
        profile: action.data,
      });
    case 'FETCH_TERM_OF_SERVICE_SUCCEED': {
      return Object.assign({}, state, {
        termOfService: action.data,
      });
    }
    case 'ACCEPT_TERM_OF_SERVICE_SUCCEED': {
      return Object.assign({}, state, {
        accessToken: action.data.token,
      });
    }
    case 'USER_SETUP_PIN_NUMBER_SUCCEED':
    case 'USER_COMPARE_PIN_NUMBER_SUCCEED':
    case 'USER_REGISTER_FAILED':
    case 'USER_VERIFY_PHONE_NUMBER_FAILED':
    case 'USER_SETUP_PIN_NUMBER_FAILED':
    case 'USER_LOGIN_FAILED':
    case 'USER_COMPARE_PIN_NUMBER_FAILED':
    case 'USER_CHANGE_PIN_NUMBER_FAILED': {
      return Object.assign({}, state, {
        isLoading: false,
      });
    }
    default:
      return state;
  }
};
