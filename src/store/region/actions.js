/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Region} from '../../services/region';
import {mutation} from './mutations';

export const getRegionsRequest = () => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.regionsFetchRequest());
  const {accessToken} = getState().user;
  const res = await Region.getRegions(accessToken);
  if (res.success) {
    dispatch(mutation.regionsFetchSuccess(res.data));
  } else {
    dispatch(mutation.regionsFetchFailure());
  }
};
