/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */

const provincesFetchRequest = () => {
  return {
    type: 'PROVINCES_FETCH_REQUESTED',
  };
};

const provincesFetchSuccess = (data, info) => {
  return {
    type: 'PROVINCES_FETCH_SUCCEED',
    data,
    info,
  };
};

const provincesFetchFailure = () => {
  return {
    type: 'PROVINCES_FETCH_FAILED',
  };
};

const provincesByUserCountryFetchRequest = () => {
  return {
    type: 'PROVINCES_BY_USER_COUNTRY_FETCH_REQUESTED',
  };
};

const provincesByUserCountryFetchSuccess = (data, info) => {
  return {
    type: 'PROVINCES_BY_USER_COUNTRY_FETCH_SUCCEED',
    data,
    info,
  };
};

const provincesByUserCountryFetchFailure = () => {
  return {
    type: 'PROVINCES_BY_USER_COUNTRY_FETCH_FAILED',
  };
};

export const mutation = {
  provincesFetchRequest,
  provincesFetchSuccess,
  provincesFetchFailure,
  provincesByUserCountryFetchRequest,
  provincesByUserCountryFetchSuccess,
  provincesByUserCountryFetchFailure,
};
