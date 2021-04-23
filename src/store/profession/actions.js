/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Profession} from '../../services/profession';
import {mutation} from './mutations';

export const getProfessionRequest = () => async (dispatch, getState) => {
  dispatch(mutation.professionFetchRequest);
  const {country_id} = getState().user.profile;
  const res = await Profession.getProfessions(country_id);
  if (res.success) {
    dispatch(mutation.professionFetchSuccess(res.data));
  } else {
    dispatch(mutation.professionFetchFailure());
  }
};
