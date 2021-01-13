/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import settings from '../../config/settings';
import {URL} from 'react-native/Libraries/Blob/URL';

const initialOptions = {
  uri: '',
  accessToken: '',
  body: {},
};

/**
 * @param options
 * @param method
 * @param isFormData
 * @param isAdminApi
 * @returns {Promise<any>}
 */
export const callApi = async (
  options = initialOptions,
  method = 'get',
  isFormData = false,
  isAdminApi = false,
) => {
  const websocket = isAdminApi ? settings.adminApiBaseURL : settings.apiBaseURL;
  const {uri, accessToken, body} = options;
  let url = websocket + uri;

  const headers = {
    Accept: 'application/json',
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const configs = {
    method,
    headers,
  };

  if (method === 'get') {
    url = new URL(url, '');
    if (body) {
      Object.keys(body).forEach((key) =>
        url.searchParams.append(key, body[key]),
      );
    }
  } else {
    configs.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, configs).catch((error) => {
    console.error('Call Api', error);
    return false;
  });

  return !response || (response && (response.status !== 200 || !response.ok))
    ? {}
    : response.json();
};
