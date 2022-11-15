/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Therapist} from '../../services/therapist';
import {mutation} from './mutations';

export const getTherapistRequest = (payload) => async (dispatch, getState) => {
  dispatch(mutation.therapistFetchRequest);
  const {accessToken} = getState().user;
  const data = await Therapist.getTherapists(payload, accessToken);
  if (data.success) {
    dispatch(mutation.therapistFetchSuccess(data.data));
  } else {
    dispatch(mutation.therapistFetchFailure());
  }
};
