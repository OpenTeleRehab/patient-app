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

export const Appointment = {
  getAppointments,
};
