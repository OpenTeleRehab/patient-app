/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const messageFetchRequest = () => {
  return {
    type: 'MESSAGE_FETCH_REQUESTED',
  };
};

const messageFetchSuccess = (data) => {
  return {
    type: 'MESSAGE_FETCH_SUCCEED',
    data,
  };
};

const messageFetchFailure = () => {
  return {
    type: 'MESSAGE_FETCH_FAILED',
  };
};

const messageSaveSuccess = (data) => {
  return {
    type: 'MESSAGE_SAVE_SUCCEED',
    data,
  };
};

const messageSaveFailure = () => {
  return {
    type: 'MESSAGE_SAVE_FAILED',
  };
};

export const mutation = {
  messageFetchRequest,
  messageFetchSuccess,
  messageFetchFailure,
  messageSaveSuccess,
  messageSaveFailure,
};
