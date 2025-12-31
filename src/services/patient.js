/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {getUserCountryIsoCode} from '../utils/country';
import {callApi} from '../utils/request';

const getPatients = async (accessToken) => {
  return await callApi(
    '/patient',
    accessToken,
    {page_size: 99999},
    'get',
    false,
    {country: getUserCountryIsoCode()}
)};

const getAllPatients = async (payload, accessToken) => {
  return await callApi(
    '/patient',
    accessToken,
    payload,
    'get',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const getPatient = async (id, accessToken) => {
  return await callApi(
    `/patient/id/${id}`,
    accessToken,
    '',
    'get',
    false,
    {country: getUserCountryIsoCode()}
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
  getAllPatients,
  getPatient,
  getPatientByPhoneNumber,
  createPatient,
  updatePatient,
  activateDeactivateAccount,
  deletePatient,
  deletePendingSupplementary,
};

