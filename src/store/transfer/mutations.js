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

export const mutation = {
  transfersFetchRequest,
  transfersFetchSuccess,
  transfersFetchFailure,
};
