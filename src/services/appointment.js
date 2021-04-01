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

const requestToCancelAppointment = async (id, payload, accessToken) => {
  return await callApi(
    `/appointment/updateStatus/${id}`,
    accessToken,
    {...payload},
    'post',
  );
};

export const Appointment = {
  getAppointments,
  requestToCancelAppointment,
};
