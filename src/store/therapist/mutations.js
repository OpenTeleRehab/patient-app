/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const therapistFetchRequest = () => {
  return {
    type: 'THERAPIST_FETCH_REQUESTED',
  };
};
const therapistFetchSuccess = (data) => {
  return {
    type: 'THERAPIST_FETCH_SUCCEED',
    data,
  };
};

const therapistFetchFailure = () => {
  return {
    type: 'THERAPIST_FETCH_FAILED',
  };
};

const phcWorkerFetchRequest = () => {
  return {
    type: 'PHC_WORKER_FETCH_REQUESTED',
  };
};
const phcWorkerFetchSuccess = (data) => {
  return {
    type: 'PHC_WORKER_FETCH_SUCCEED',
    data,
  };
};

const phcWorkerFetchFailure = () => {
  return {
    type: 'PHC_WORKER_FETCH_FAILED',
  };
};

const referralTherapistsFetchRequest = () => {
  return {
    type: 'REFERRAL_THERAPISTS_FETCH_REQUESTED',
  };
};
const referralTherapistsFetchSuccess = (data) => {
  return {
    type: 'REFERRAL_THERAPISTS_FETCH_SUCCEED',
    data,
  };
};

const referralTherapistsFetchFailure = () => {
  return {
    type: 'REFERRAL_THERAPISTS_FETCH_FAILED',
  };
};

const patientPhcWorkersFetchRequest = () => {
  return {
    type: 'PATIENT_PHC_WORKERS_FETCH_REQUESTED',
  };
};
const patientPhcWorkersFetchSuccess = (data) => {
  return {
    type: 'PATIENT_PHC_WORKERS_FETCH_SUCCEED',
    data,
  };
};

const patientPhcWorkersFetchFailure = () => {
  return {
    type: 'PATIENT_PHC_WORKERS_FETCH_FAILED',
  };
};

export const mutation = {
  therapistFetchRequest,
  therapistFetchSuccess,
  therapistFetchFailure,
  phcWorkerFetchRequest,
  phcWorkerFetchSuccess,
  phcWorkerFetchFailure,
  referralTherapistsFetchRequest,
  referralTherapistsFetchSuccess,
  referralTherapistsFetchFailure,
  patientPhcWorkersFetchRequest,
  patientPhcWorkersFetchSuccess,
  patientPhcWorkersFetchFailure,
};
