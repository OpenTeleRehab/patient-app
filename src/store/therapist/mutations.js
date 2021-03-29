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

export const mutation = {
  therapistFetchRequest,
  therapistFetchSuccess,
  therapistFetchFailure,
};
