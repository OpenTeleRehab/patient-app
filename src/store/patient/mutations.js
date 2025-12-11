/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const patientsFetchRequest = () => {
  return {
    type: 'PATIENTS_FETCH_REQUESTED',
  };
};

const patientsFetchSuccess = (data, info) => {
  return {
    type: 'PATIENTS_FETCH_SUCCEED',
    data,
    info,
  };
};

const patientsFetchFailure = () => {
  return {
    type: 'PATIENTS_FETCH_FAILED',
  };
};

const patientFetchRequest = () => {
  return {
    type: 'PATIENT_FETCH_REQUESTED',
  };
};

const patientFetchSuccess = (data, info) => {
  return {
    type: 'PATIENT_FETCH_SUCCEED',
    data,
    info,
  };
};

const patientFetchFailure = () => {
  return {
    type: 'PATIENT_FETCH_FAILED',
  };
};

export const mutation = {
  patientsFetchRequest,
  patientsFetchSuccess,
  patientsFetchFailure,
  patientFetchRequest,
  patientFetchSuccess,
  patientFetchFailure,
};
