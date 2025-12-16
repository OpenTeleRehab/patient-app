/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */

const phcServicesFetchRequest = () => {
  return {
    type: 'PHC_SERVICES_FETCH_REQUESTED',
  };
};

const phcServicesFetchSuccess = (data, info) => {
  return {
    type: 'PHC_SERVICES_FETCH_SUCCEED',
    data,
    info,
  };
};

const phcServicesFetchFailure = () => {
  return {
    type: 'PHC_SERVICES_FETCH_FAILED',
  };
};

const phcWorkersFetchRequest = () => {
  return {
    type: 'PHC_WORKERS_FETCH_REQUESTED',
  };
};

const phcWorkersFetchSuccess = (data, info) => {
  return {
    type: 'PHC_WORKERS_FETCH_SUCCEED',
    data,
    info,
  };
};

const phcWorkersFetchFailure = () => {
  return {
    type: 'PHC_WORKERS_FETCH_FAILED',
  };
};

export const mutation = {
  phcServicesFetchRequest,
  phcServicesFetchSuccess,
  phcServicesFetchFailure,
  phcWorkersFetchRequest,
  phcWorkersFetchSuccess,
  phcWorkersFetchFailure,
};
