/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getCountries = async () => {
  const options = {
    uri: '/country',
  };

  return await callApi(options, 'get', false, true);
};

export const Country = {
  getCountries,
};
