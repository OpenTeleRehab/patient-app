/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
const clinicFetchRequest = () => {
  return {
    type: 'CLINIC_FETCH_REQUESTED',
  };
};
const clinicFetchSuccess = (data) => {
  return {
    type: 'CLINIC_FETCH_SUCCEED',
    data,
  };
};

const clinicFetchFailure = () => {
  return {
    type: 'CLINIC_FETCH_FAILED',
  };
};

const clinicListFetchRequest = () => {
  return {
    type: 'CLINIC_LIST_FETCH_REQUESTED',
  };
};

const clinicListFetchSuccess = (data) => {
  return {
    type: 'CLINIC_LIST_FETCH_SUCCEED',
    data,
  };
};

const clinicListFetchFailure = () => {
  return {
    type: 'CLINIC_LIST_FETCH_FAILED',
  };
};

export const mutation = {
  clinicFetchRequest,
  clinicFetchSuccess,
  clinicFetchFailure,
  clinicListFetchRequest,
  clinicListFetchSuccess,
  clinicListFetchFailure,
};
