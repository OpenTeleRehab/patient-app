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

export const mutation = {
  clinicFetchRequest,
  clinicFetchSuccess,
  clinicFetchFailure,
};
