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

const getDefinedCountriesRequest = () => ({
  type: 'GET_DEFINED_COUNTRIES_REQUEST',
});

const getDefinedCountriesSuccess = (data) => ({
  type: 'GET_DEFINED_COUNTRIES_SUCCESS',
  data,
});

const getDefinedCountriesFail = () => ({
  type: 'GET_DEFINED_COUNTRIES_FAIL',
});

export const mutation = {
  countryFetchRequest,
  countryFetchSuccess,
  countryFetchFailure,
  getDefinedCountriesRequest,
  getDefinedCountriesSuccess,
  getDefinedCountriesFail,
};
