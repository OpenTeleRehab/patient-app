/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const regionsFetchRequest = () => {
  return {
    type: 'REGIONS_FETCH_REQUESTED',
  };
};

const regionsFetchSuccess = (data, info) => {
  return {
    type: 'REGIONS_FETCH_SUCCEED',
    data,
    info,
  };
};

const regionsFetchFailure = () => {
  return {
    type: 'REGIONS_FETCH_FAILED',
  };
};

export const mutation = {
  regionsFetchRequest,
  regionsFetchSuccess,
  regionsFetchFailure,
};
