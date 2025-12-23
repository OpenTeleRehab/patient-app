/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {getUserCountryIsoCode} from '../utils/country';
import {callApi} from '../utils/request';

const getPatients = async (payload, accessToken) => {
  const {filters, ...rest} = payload;
  const params = new URLSearchParams();
  if (filters.length > 0) {
    filters.forEach((filter) => {
      params.append('filters[]', JSON.stringify(filter));
    });
  }
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value);
    }
  });

  return await callApi(
    `/patient?${params.toString()}`,
    accessToken,
  );
};

const getPatient = async (id, accessToken) => {
  return await callApi(
    `/patient/id/${id}`,
    accessToken,
  );
};

const getPatientByPhoneNumber = async (phone, accessToken, patientId) => {
  let payloads = '';

  if (patientId !== '') {
    payloads = {phone: phone, patient_id: patientId};
  } else {
    payloads = {phone: phone};
  }

  return await callApi(
    '/patient/by-phone-number',
    accessToken,
    {...payloads},
    'get',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const createPatient = async (payload, accessToken) => {
  return await callApi(
    '/patient',
    accessToken,
    {...payload},
    'post',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const updatePatient = async (id, payload, accessToken) => {
  return await callApi(
    `/patient/${id}`,
    accessToken,
    {...payload},
    'put',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const activateDeactivateAccount = async (id, accessToken, enabled) => {
  return await callApi(`/patient/activateDeactivateAccount/${id}`, accessToken, {enabled}, 'post', false, {country: getUserCountryIsoCode()});
};

const deletePatient = async (id, accessToken) => {
  return await callApi(
    `/patient/deleteAccount/${id}`,
    accessToken,
    null,
    'post',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const deletePendingSupplementary = async (id, accessToken) => {
  return await callApi(
    `/transfer/${id}`,
    accessToken,
    null,
    'delete',
  );
};

export const Patient = {
  getPatients,
  getPatient,
  getPatientByPhoneNumber,
  createPatient,
  updatePatient,
  activateDeactivateAccount,
  deletePatient,
  deletePendingSupplementary,
};

