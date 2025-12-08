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

export const mutation = {
  therapistFetchRequest,
  therapistFetchSuccess,
  therapistFetchFailure,
  phcWorkerFetchRequest,
  phcWorkerFetchSuccess,
  phcWorkerFetchFailure,
};
