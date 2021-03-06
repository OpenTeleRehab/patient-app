/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Country} from '../../services/country';
import {mutation} from './mutations';

export const getCountryRequest = () => async (dispatch) => {
  dispatch(mutation.countryFetchRequest);
  const data = await Country.getCountries();
  if (data.success) {
    dispatch(mutation.countryFetchSuccess(data.data, data.user_country_code));
  } else {
    dispatch(mutation.countryFetchFailure());
  }
};

export const getDefinedCountries = () => async (dispatch) => {
  dispatch(mutation.getDefinedCountriesRequest());
  const data = await Country.getDefinedCountries();
  if (data.success) {
    dispatch(mutation.getDefinedCountriesSuccess(data.data));
  } else {
    dispatch(mutation.getDefinedCountriesFail());
  }
};
