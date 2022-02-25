/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const phoneFetchRequest = () => {
  return {
    type: 'PHONE_FETCH_REQUESTED',
  };
};
const phoneFetchSuccess = (data) => {
  return {
    type: 'PHONE_FETCH_SUCCEED',
    data,
  };
};

const phoneFetchFailure = () => {
  return {
    type: 'PHONE_FETCH_FAILED',
  };
};

export const mutation = {
  phoneFetchRequest,
  phoneFetchSuccess,
  phoneFetchFailure,
};
