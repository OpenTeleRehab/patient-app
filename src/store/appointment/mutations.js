/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const appointmentFetchRequest = () => {
  return {
    type: 'APPOINTMENT_FETCH_REQUESTED',
  };
};

const appointmentFetchSuccess = (data, info) => {
  return {
    type: 'APPOINTMENT_FETCH_SUCCEED',
    data,
    info,
  };
};

const appointmentFetchFailure = () => {
  return {
    type: 'APPOINTMENT_FETCH_FAILED',
  };
};

const appointmentRequestRequest = () => {
  return {
    type: 'APPOINTMENT_REQUEST_REQUESTED',
  };
};

const appointmentRequestSuccess = () => {
  return {
    type: 'APPOINTMENT_REQUEST_SUCCEED',
  };
};

const appointmentRequestFailure = () => {
  return {
    type: 'APPOINTMENT_REQUEST_FAILED',
  };
};

const updateStatusRequest = () => {
  return {
    type: 'UPDATE_STATUS_REQUESTED',
  };
};

const updateStatusSuccess = () => {
  return {
    type: 'UPDATE_STATUS_SUCCEED',
  };
};

const updateAppointmentRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_REQUEST',
  };
};

const updateStatusFailure = () => {
  return {
    type: 'UPDATE_STATUS_FAILED',
  };
};

const deleteAppointmentRequest = () => {
  return {
    type: 'DELETE_APPOINTMENT_REQUEST',
  };
};

export const mutation = {
  appointmentFetchRequest,
  appointmentFetchSuccess,
  appointmentFetchFailure,
  appointmentRequestRequest,
  appointmentRequestSuccess,
  appointmentRequestFailure,
  updateStatusRequest,
  updateStatusSuccess,
  updateStatusFailure,
  updateAppointmentRequest,
  deleteAppointmentRequest,
};
