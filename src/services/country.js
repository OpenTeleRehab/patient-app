/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi, callApi} from '../utils/request';
import {callGlobalAdminApi} from '../utils/request';

const getCountries = async () => {
  return await callAdminApi('/country');
};

const getDefinedCountries = async () => {
  return await callGlobalAdminApi('/country/list/defined-country');
};

const getCountryCodeByClinicId = async (payload) => {
  return await callApi('/country/list/by-clinic', '', payload);
};

export const Country = {
  getCountries,
  getDefinedCountries,
  getCountryCodeByClinicId,
};
