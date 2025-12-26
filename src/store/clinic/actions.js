/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import {Clinic} from '../../services/clinic';
import {mutation} from './mutations';

export const getClinicRequest = (payload) => async (dispatch) => {
  dispatch(mutation.clinicFetchRequest);
  const data = await Clinic.getClinic(payload);
  if (data.data) {
    dispatch(mutation.clinicFetchSuccess(data.data));
  } else {
    dispatch(mutation.clinicFetchFailure());
  }
};

export const getClinicListRequest =
  (countryId) => async (dispatch, getState) => {
    dispatch(mutation.clinicListFetchRequest());
    const {accessToken} = getState().user;
    const res = await Clinic.getClinicList(countryId, accessToken);
    if (res.success) {
      dispatch(mutation.clinicListFetchSuccess(res.data));
    } else {
      dispatch(mutation.clinicListFetchFailure());
    }
  };
