/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';
import {callGlobalAdminApi} from '../utils/request';

const getCountries = async () => {
  return await callAdminApi('/country');
};

const getDefinedCountries = async () => {
  return await callGlobalAdminApi('/country/list/defined-country');
};

export const Country = {
  getCountries,
  getDefinedCountries,
};
