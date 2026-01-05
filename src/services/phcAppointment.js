/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {getUserCountryIsoCode} from '../utils/country';
import {callApi} from '../utils/request';

const getAppointmentsWithPatient = async (payload, accessToken) => {
  return await callApi(
    '/appointment',
    accessToken,
    payload,
    'get',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const createAppointmentWithPatient = async (payload, accessToken) => {
  return await callApi(
    '/appointment',
    accessToken,
    {...payload},
    'post',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const updateAppointmentWithPatientStatus = async (id, payload, accessToken) => {
  return await callApi(
    `/appointment/updateStatus/${id}`,
    accessToken,
    {...payload},
    'post',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const updateAppointmentWithPatient = async (id, payload, accessToken) => {
  return await callApi(`/appointment/${id}`, accessToken, {...payload}, 'put', false, {country: getUserCountryIsoCode()});
};

const deleteAppointmentWithPatient = async (id, accessToken) => {
  return await callApi(`/appointment/${id}`, accessToken, null, 'delete', false, {country: getUserCountryIsoCode()});
};

const getAppointments = async (payload, accessToken) => {
  return await callApi(
    '/appointments',
    accessToken,
    payload,
  );
};

const createAppointment = async (payload, accessToken) => {
  return await callApi(
    '/appointments',
    accessToken,
    {...payload},
    'post',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const acceptAppointment = async (id, accessToken) => {
  return await callApi(
    `/appointments/${id}/accept`,
    accessToken,
    null,
    'post',
  );
};

const declineAppointment = async (id, accessToken) => {
  return await callApi(
    `/appointments/${id}/decline`,
    accessToken,
    null,
    'post',
  );
};

const updateAppointment = async (id, payload, accessToken) => {
  return await callApi(`/appointments/${id}`, accessToken, {...payload}, 'put', false, {country: getUserCountryIsoCode()});
};

const deleteAppointment= async (id, accessToken) => {
  return await callApi(`/appointments/${id}`, accessToken, null, 'delete');
};

const updateAppointmentWithPatientUnreadStatus = async (payload, accessToken) => {
  return await callApi(
    '/appointment/update-as-read',
    accessToken,
    {...payload},
    'put',
    false,
    {country: getUserCountryIsoCode()}
  );
};

const updateAppointmentUnreadStatus = async (payload, accessToken) => {
  return await callApi(
    '/appointments/bulk/mark-as-read',
    accessToken,
    payload,
    'put',
  );
};

export const PhcAppointment = {
  getAppointmentsWithPatient,
  createAppointmentWithPatient,
  updateAppointmentWithPatientStatus,
  updateAppointmentWithPatient,
  deleteAppointmentWithPatient,
  getAppointments,
  createAppointment,
  acceptAppointment,
  declineAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentWithPatientUnreadStatus,
  updateAppointmentUnreadStatus,
};