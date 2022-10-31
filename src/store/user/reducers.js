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
    case 'USER_CHANGE_PIN_NUMBER_REQUESTED':
    case 'ACCEPT_TERM_OF_SERVICE_REQUESTED': {
      return Object.assign({}, state, {
        isLoading: true,
      });
    }
    case 'USER_REGISTER_SUCCEED': {
      return Object.assign({}, state, {
        dial_code: action.data.dialCode,
        phone: action.data.to,
        countryCode: action.data.country,
        isLoading: false,
      });
    }
    case 'USER_VERIFY_PHONE_NUMBER_SUCCEED': {
      return Object.assign({}, state, {
        otpCode: action.data.code,
        isLoading: false,
        isNewRegister: true,
        isDataUpToDate: true,
      });
    }
    case 'USER_CHANGE_PIN_NUMBER_SUCCEED':
    case 'USER_LOGIN_SUCCEED': {
      return Object.assign({}, state, {
        profile: action.data.profile,
        accessToken: action.data.token,
        phone: action.phone,
        initialRouteName: ROUTES.LOGIN,
        isLoading: false,
        pin: action.pin,
        isNewRegister: false,
        isDataUpToDate: true,
      });
    }
    case 'USER_LOGOUT_SUCCEED': {
      return Object.assign({}, state, {
        accessToken: '',
        initialRouteName: ROUTES.LOGIN,
        isDataUpToDate: true,
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
        termOfService: action.data || {},
      });
    }
    case 'FETCH_PRIVACY_POLICY_SUCCEED': {
      return Object.assign({}, state, {
        privacyPolicy: action.data || {},
      });
    }
    case 'ACCEPT_TERM_OF_SERVICE_SUCCEED': {
      return Object.assign({}, state, {
        accessToken: action.data.token,
        isLoading: false,
      });
    }
    case 'ACCEPT_PRIVACY_POLICY_SUCCEED': {
      return Object.assign({}, state, {
        accessToken: action.data.token,
        isLoading: false,
      });
    }
    case 'USER_SETUP_PIN_NUMBER_SUCCEED': {
      return Object.assign({}, state, {
        pin: action.pin,
        isLoading: false,
      });
    }
    case 'USER_COMPARE_PIN_NUMBER_SUCCEED':
    case 'USER_REGISTER_FAILED':
    case 'USER_VERIFY_PHONE_NUMBER_FAILED':
    case 'USER_SETUP_PIN_NUMBER_FAILED':
    case 'USER_LOGIN_FAILED':
    case 'USER_COMPARE_PIN_NUMBER_FAILED':
    case 'USER_CHANGE_PIN_NUMBER_FAILED':
    case 'ACCEPT_TERM_OF_SERVICE_FAILED': {
      return Object.assign({}, state, {
        isLoading: false,
      });
    }
    case 'GENERATE_FAKE_ACCESS_TOKEN_SUCCESS': {
      return Object.assign({}, state, {
        accessToken: 'FAKE_ACCESS_TOKEN',
        isDataUpToDate: false,
      });
    }
    case 'ENABLE_KID_THEME_REQUESTED':
    case 'ENABLE_KID_THEME_SUCCEED': {
      if (action.data && action.data.profile) {
        return Object.assign({}, state, {
          profile: action.data.profile,
        });
      }
      return state;
    }
    case 'ENABLE_KID_THEME_FAILED':
    case 'USER_CREATE_FIREBASE_TOKEN_REQUEST':
    case 'USER_CREATE_FIREBASE_TOKEN_SUCCESS': {
      return Object.assign({}, state, {
        firebaseToken: action.firebase_token,
      });
    }
    case 'USER_CREATE_FIREBASE_TOKEN_FAILED':
    default:
      return state;
  }
};
