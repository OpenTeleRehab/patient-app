/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import {callApi, callGlobalAdminApi} from '../utils/request';

const getClinic = async (id) => {
  return await callGlobalAdminApi(`/clinic/get-by-id/${id}`, '');
};

const getClinicList = async (countryId, accessToken) => {
  return await callApi(`/clinic?country_id=${countryId}`, accessToken);
};

export const Clinic = {
  getClinic,
  getClinicList,
};
