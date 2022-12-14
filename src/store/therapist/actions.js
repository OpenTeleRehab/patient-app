/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Therapist} from '../../services/therapist';
import {mutation} from './mutations';

export const getTherapistRequest = (payload) => async (dispatch, getState) => {
  dispatch(mutation.therapistFetchRequest);
  const data = await Therapist.getTherapists(payload);
  if (data.success) {
    dispatch(mutation.therapistFetchSuccess(data.data));
  } else {
    dispatch(mutation.therapistFetchFailure());
  }
};
