/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import {Clinic} from '../../services/clinic';
import {mutation} from './mutations';

export const getClinicRequest = (payload) => async (dispatch) => {
  dispatch(mutation.clinicFetchRequest);
  const data = await Clinic.getClinic(payload);
  if (data.success) {
    dispatch(mutation.clinicFetchSuccess(data.data));
  } else {
    dispatch(mutation.clinicFetchFailure());
  }
};
