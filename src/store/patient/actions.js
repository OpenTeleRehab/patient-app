/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Patient} from '../../services/patient';
import {mutation} from './mutations';

export const getPatientsListRequest = (payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.patientsFetchRequest());
  const {accessToken} = getState().user;
  const res = await Patient.getPatients(payload, accessToken);
  if (res.success) {
    dispatch(mutation.patientsFetchSuccess(res.data, res.info));
  } else {
    dispatch(mutation.patientsFetchFailure());
  }
};

export const getPatientRequest = (id) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.patientFetchRequest());
  const {accessToken} = getState().user;
  const data = await Patient.getPatient(id, accessToken);
  if (data) {
    console.log('patient data', data);
    dispatch(mutation.patientFetchSuccess(data));
  } else {
    dispatch(mutation.patientFetchFailure());
  }
};
