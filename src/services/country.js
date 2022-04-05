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

const getCountryCodeByClinicId = async (clinic_id) => {
  return await callAdminApi(`/country/list/by-clinic?clinic_id=${clinic_id}`);
};

export const Country = {
  getCountries,
  getDefinedCountries,
  getCountryCodeByClinicId,
};
