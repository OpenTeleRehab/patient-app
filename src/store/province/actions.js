/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Province} from '../../services/province';
import {mutation} from './mutations';

export const getProvincesRequest = () => async (dispatch, getState) => {
  dispatch(mutation.provincesFetchRequest());
  const {accessToken} = getState().user;
  const res = await Province.getProvinces(accessToken);
  if (res.success) {
    dispatch(mutation.provincesFetchSuccess(res.data));
  } else {
    dispatch(mutation.provincesFetchFailure());
  }
};

export const getProvincesByUserCountryRequest =
  () => async (dispatch, getState) => {
    dispatch(mutation.provincesByUserCountryFetchRequest());
    const {accessToken} = getState().user;
    const res = await Province.getProvincesByUserCountry(accessToken);
    if (res) {
      dispatch(mutation.provincesByUserCountryFetchSuccess(res));
    } else {
      dispatch(mutation.provincesByUserCountryFetchFailure());
    }
  };
