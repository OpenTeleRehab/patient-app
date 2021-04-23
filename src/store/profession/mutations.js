/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const professionFetchRequest = () => {
  return {
    type: 'PROFESSION_FETCH_REQUESTED',
  };
};
const professionFetchSuccess = (data) => {
  return {
    type: 'PROFESSION_FETCH_SUCCEED',
    data,
  };
};

const professionFetchFailure = () => {
  return {
    type: 'PROFESSION_FETCH_FAILED',
  };
};

export const mutation = {
  professionFetchRequest,
  professionFetchSuccess,
  professionFetchFailure,
};
