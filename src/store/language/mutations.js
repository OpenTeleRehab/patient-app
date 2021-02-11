/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const languageFetchRequest = () => {
  return {
    type: 'LANGUAGE_FETCH_REQUESTED',
  };
};
const languageFetchSuccess = (data) => {
  return {
    type: 'LANGUAGE_FETCH_SUCCEED',
    data,
  };
};

const languageFetchFailure = () => {
  return {
    type: 'LANGUAGE_FETCH_FAILED',
  };
};

export const mutation = {
  languageFetchRequest,
  languageFetchSuccess,
  languageFetchFailure,
};
