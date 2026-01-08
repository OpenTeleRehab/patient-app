/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */

//Patient for Phc worker
const patientsForPhcWorkerFetchRequest = () => {
  return {
    type: 'PATIENTS_FOR_PHC_WORKER_FETCH_REQUESTED',
  };
};

const patientsForPhcWorkerFetchSuccess = (data) => {
  return {
    type: 'PATIENTS_FOR_PHC_WORKER_FETCH_SUCCEED',
    data,
  };
};

const patientsForPhcWorkerFetchFailure = () => {
  return {
    type: 'PATIENTS_FOR_PHC_WORKER_FETCH_FAILED',
  };
};

const patientsFetchRequest = () => {
  return {
    type: 'PATIENTS_FETCH_REQUESTED',
  };
};

const patientsFetchSuccess = (data) => {
  return {
    type: 'PATIENTS_FETCH_SUCCEED',
    data,
  };
};

const patientsFetchFailure = () => {
  return {
    type: 'PATIENTS_FETCH_FAILED',
  };
};

const allPatientsFetchRequest = () => {
  return {
    type: 'ALL_PATIENTS_FETCH_REQUESTED',
  };
};

const allPatientsFetchSuccess = (data) => {
  return {
    type: 'ALL_PATIENTS_FETCH_SUCCEED',
    data,
  };
};

const allPatientsFetchFailure = () => {
  return {
    type: 'ALL_PATIENTS_FETCH_FAILED',
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

const patientByPhoneFetchRequest = () => {
  return {
    type: 'PATIENT_BY_PHONE_FETCH_REQUESTED',
  };
};

const patientByPhoneFetchSuccess = () => {
  return {
    type: 'PATIENT_BY_PHONE_FETCH_SUCCEED',
  };
};

const patientByPhoneFetchFailure = () => {
  return {
    type: 'PATIENT_BY_PHONE_FETCH_FAILED',
  };
};

const patientCreateRequest = () => {
  return {
    type: 'PATIENT_CREATE_REQUESTED',
  };
};

const patientCreateSuccess = (data) => {
  return {
    type: 'PATIENT_CREATE_SUCCEED',
    data,
  };
};

const patientCreateFailure = () => {
  return {
    type: 'PATIENT_CREATE_FAILED',
  };
};

const patientUpdateRequest = () => {
  return {
    type: 'PATIENT_UPDATE_REQUESTED',
  };
};

const patientUpdateSuccess = (data) => {
  return {
    type: 'PATIENT_UPDATE_SUCCEED',
    data,
  };
};

const patientUpdateFailure = () => {
  return {
    type: 'PATIENT_UPDATE_FAILED',
  };
};

const patientDeleteRequest = () => {
  return {
    type: 'PATIENT_DELETE_REQUESTED',
  };
};

const patientDeleteSuccess = (data) => {
  return {
    type: 'PATIENT_DELETE_SUCCEED',
    data,
  };
};

const patientDeleteFailure = () => {
  return {
    type: 'PATIENT_DELETE_FAILED',
  };
};

const activateDeactivateAccountRequest = () => {
  return {
    type: 'PATIENT_ACTIVATE_DEACTIVATE_ACCOUNT_REQUESTED',
  };
};

const activateDeactivateAccountSuccess = (data) => {
  return {
    type: 'PATIENT_ACTIVATE_DEACTIVATE_ACCOUNT_SUCCEED',
    data,
  };
};

const activateDeactivateAccountFailure = () => {
  return {
    type: 'PATIENT_ACTIVATE_DEACTIVATE_ACCOUNT_FAILED',
  };
};

const deletePendingSupplementaryRequest = () => {
  return {
    type: 'DELETE_PENDING_SUPPLEMENTARY_REQUESTED',
  };
};

const deletePendingSupplementarySuccess = (data) => {
  return {
    type: 'DELETE_PENDING_SUPPLEMENTARY_SUCCEED',
    data,
  };
};

const deletePendingSupplementaryFailure = () => {
  return {
    type: 'DELETE_PENDING_SUPPLEMENTARY_FAILED',
  };
};

const filtersUpdateSuccess = (data) => {
  return {
    type: 'FILTERS_UPDATE_SUCCEED',
    data,
  };
};

export const mutation = {
  patientsForPhcWorkerFetchRequest,
  patientsForPhcWorkerFetchSuccess,
  patientsForPhcWorkerFetchFailure,
  patientsFetchRequest,
  patientsFetchSuccess,
  patientsFetchFailure,
  allPatientsFetchRequest,
  allPatientsFetchSuccess,
  allPatientsFetchFailure,
  patientFetchRequest,
  patientFetchSuccess,
  patientFetchFailure,
  patientByPhoneFetchRequest,
  patientByPhoneFetchSuccess,
  patientByPhoneFetchFailure,
  patientCreateRequest,
  patientCreateSuccess,
  patientCreateFailure,
  patientUpdateRequest,
  patientUpdateSuccess,
  patientUpdateFailure,
  patientDeleteRequest,
  patientDeleteSuccess,
  patientDeleteFailure,
  activateDeactivateAccountRequest,
  activateDeactivateAccountSuccess,
  activateDeactivateAccountFailure,
  deletePendingSupplementaryRequest,
  deletePendingSupplementarySuccess,
  deletePendingSupplementaryFailure,
  filtersUpdateSuccess,
};
