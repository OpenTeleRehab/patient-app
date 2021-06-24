/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getCountries = async () => {
  return await callAdminApi('/country');
};

const getDefinedCountries = async () => {
  return await callAdminApi('/country/list/defined-country');
};

export const Country = {
  getCountries,
  getDefinedCountries,
};
