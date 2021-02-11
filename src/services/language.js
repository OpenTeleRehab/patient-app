/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getLanguages = async () => {
  const options = {
    uri: '/language',
  };

  return await callApi(options, 'get', false, true);
};

export const Language = {
  getLanguages,
};
