/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const transfersFetchRequest = () => {
  return {
    type: 'TRANSFERS_FETCH_REQUESTED',
  };
};

const transfersFetchSuccess = (data, info) => {
  return {
    type: 'TRANSFERS_FETCH_SUCCEED',
    data,
    info,
  };
};

const transfersFetchFailure = () => {
  return {
    type: 'TRANSFERS_FETCH_FAILED',
  };
};

const createTransferPatientRequest = () => {
  return {
    type: 'CREATE_TRANSFER_PATIENT_REQUESTED',
  };
};

const createTransferPatientSuccess = () => {
  return {
    type: 'CREATE_TRANSFER_PATIENT_SUCCEED',
  };
};
const createTransferPatientFailure = () => {
  return {
    type: 'CREATE_TRANSFER_PATIENT_FAILED',
  };
};

const acceptTransferPatientRequest = () => {
  return {
    type: 'ACCEPT_TRANSFER_PATIENT_REQUESTED',
  };
};
const acceptTransferPatientSuccess = () => {
  return {
    type: 'ACCEPT_TRANSFER_PATIENT_SUCCEED',
  };
};
const acceptTransferPatientFailure = () => {
  return {
    type: 'ACCEPT_TRANSFER_PATIENT_FAILED',
  };
};

const declineTransferPatientRequest = () => {
  return {
    type: 'DECLINE_TRANSFER_PATIENT_REQUESTED',
  };
};
const declineTransferPatientSuccess = () => {
  return {
    type: 'DECLINE_TRANSFER_PATIENT_SUCCEED',
  };
};
const declineTransferPatientFailure = () => {
  return {
    type: 'DECLINE_TRANSFER_PATIENT_FAILED',
  };
};

export const mutation = {
  transfersFetchRequest,
  transfersFetchSuccess,
  transfersFetchFailure,
  createTransferPatientRequest,
  createTransferPatientSuccess,
  createTransferPatientFailure,
  acceptTransferPatientRequest,
  acceptTransferPatientSuccess,
  acceptTransferPatientFailure,
  declineTransferPatientRequest,
  declineTransferPatientSuccess,
  declineTransferPatientFailure,
};
