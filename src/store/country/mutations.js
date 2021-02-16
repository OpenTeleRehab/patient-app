/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const countryFetchRequest = () => {
  return {
    type: 'COUNTRY_FETCH_REQUESTED',
  };
};
const countryFetchSuccess = (data, userCountryCode) => {
  return {
    type: 'COUNTRY_FETCH_SUCCEED',
    data,
    userCountryCode,
  };
};

const countryFetchFailure = () => {
  return {
    type: 'COUNTRY_FETCH_FAILED',
  };
};

export const mutation = {
  countryFetchRequest,
  countryFetchSuccess,
  countryFetchFailure,
};
