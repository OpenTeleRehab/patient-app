/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getAppointments = async (payload, accessToken) => {
  return await callApi(
    '/appointment/get-patient-appointments',
    accessToken,
    payload,
  );
};

const requestAppointment = async (payload, accessToken) => {
  return await callApi(
    '/appointment/request-appointment',
    accessToken,
    {...payload},
    'post',
  );
};

const updateStatus = async (id, payload, accessToken) => {
  return await callApi(
    `/appointment/update-patient-status/${id}`,
    accessToken,
    {...payload},
    'post',
  );
};

export const Appointment = {
  getAppointments,
  requestAppointment,
  updateStatus,
};
