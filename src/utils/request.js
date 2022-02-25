/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import settings from '../../config/settings';
import {getUserCountryIsoCode} from './country';
import {forceLogout} from '../store/auth/actions';
import store from '../store';
import {Alert} from 'react-native';
import {getTranslate} from 'react-localize-redux';

export const callApi = async (
  uri,
  accessToken = '',
  body = null,
  method = 'get',
  isFormData = false,
  headers = {},
) => {
  const endpoint = store.getState().phone.apiBaseURL + uri;
  const allHeaders = {
    country: getUserCountryIsoCode(),
    ...getHeaders(accessToken, isFormData),
    ...headers,
  };
  body = isFormData || method === 'get' ? body : JSON.stringify(body);
  return await fetchApi(endpoint, allHeaders, body, method);
};

export const callAdminApi = async (uri, body = null) => {
  const endpoint = store.getState().phone.adminApiBaseURL + uri;
  const headers = getHeaders();
  return await fetchApi(endpoint, headers, body);
};

export const callTherapistApi = async (uri, body = null) => {
  const endpoint = store.getState().phone.therapistApiBaseURL + uri;
  const headers = getHeaders();
  return await fetchApi(endpoint, headers, body);
};

export const callPhoneApi = async (uri, body = null) => {
  const endpoint = settings.phoneApiBaseURL + uri;
  const headers = getHeaders();
  return await fetchApi(endpoint, headers, body);
};

export const callGlobalAdminApi = async (uri, body = null) => {
  const endpoint = settings.adminApiBaseURL + uri;
  const headers = getHeaders();
  return await fetchApi(endpoint, headers, body);
};

export const callChatApi = async (
  uri,
  userId,
  authToken,
  body = null,
  method = 'get',
  isFormData = false,
) => {
  const endpoint = store.getState().phone.chatBaseURL + '/api/v1' + uri;
  const defaultHeaders = getHeaders('', isFormData);
  const headers = {
    ...defaultHeaders,
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
  };
  return await fetchApi(endpoint, headers, body, method);
};

const fetchApi = async (endpoint, headers, body = null, method = 'get') => {
  let url = endpoint;
  const configs = {
    method,
    headers,
  };
  if (method === 'get') {
    if (body) {
      const queryString = Object.keys(body)
        .reduce((result, key) => {
          return [
            ...result,
            `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`,
          ];
        }, [])
        .join('&');
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  } else {
    configs.body = body;
  }

  const response = await fetch(url, configs).catch((error) => {
    return false;
  });

  if (response.status === 401) {
    const localize = store.getState().localize;
    const translate = getTranslate(localize);
    store.dispatch(forceLogout());
    Alert.alert(translate('user.session'), translate('user.session_expired'));
  }

  return !response || (response && (response.status !== 200 || !response.ok))
    ? {}
    : response.json();
};

const getHeaders = (accessToken = '', isFormData = false) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
};
