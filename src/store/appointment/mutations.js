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

const appointmentRequestToCancelRequest = () => {
  return {
    type: 'APPOINTMENT_REQUEST_TO_CANCEL_REQUESTED',
  };
};

const appointmentRequestToCancelSuccess = () => {
  return {
    type: 'APPOINTMENT_REQUEST_TO_CANCEL_SUCCEED',
  };
};

const appointmentRequestToCancelFailure = () => {
  return {
    type: 'APPOINTMENT_REQUEST_TO_CANCEL_FAILED',
  };
};

export const mutation = {
  appointmentFetchRequest,
  appointmentFetchSuccess,
  appointmentFetchFailure,
  appointmentRequestRequest,
  appointmentRequestSuccess,
  appointmentRequestFailure,
  appointmentRequestToCancelRequest,
  appointmentRequestToCancelSuccess,
  appointmentRequestToCancelFailure,
};
