/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Patient} from '../../services/patient';
import {mutation} from './mutations';
import {getPhcServiceIdentity} from '../../utils/patient';
import {getTransfersRequest} from '../transfer/actions';

export const getPatientsListRequest =
  (payload) => async (dispatch, getState) => {
    dispatch(mutation.patientsFetchRequest());
    const {accessToken} = getState().user;
    const res = await Patient.getPatients(payload, accessToken);
    if (res.success) {
      dispatch(mutation.patientsFetchSuccess(res.data, payload.page, res.info, payload.filters));
    } else {
      dispatch(mutation.patientsFetchFailure());
    }
  };

export const getPatientRequest = (id) => async (dispatch, getState) => {
  dispatch(mutation.patientFetchRequest());
  const {accessToken} = getState().user;
  const data = await Patient.getPatient(id, accessToken);
  if (data) {
    dispatch(mutation.patientFetchSuccess(data));
  } else {
    dispatch(mutation.patientFetchFailure());
  }
};

export const getPatientByPhoneRequest = (phone, patientId) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.patientByPhoneFetchRequest());
  const {accessToken} = getState().user;
  const data = await Patient.getPatientByPhoneNumber(phone, accessToken, patientId);
  if (data.success) {
    dispatch(mutation.patientByPhoneFetchSuccess());
    return {success: true, data: data.data};
  } else {
    dispatch(mutation.patientByPhoneFetchFailure());
    return {success: false, message: data.message};
  }
};

export const createPatientRequest = (payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.patientCreateRequest());
  const {accessToken} = getState().user;
  const data = await Patient.createPatient({...payload, phc_service_identity: getPhcServiceIdentity()}, accessToken);
  if (data.success) {
    dispatch(mutation.patientCreateSuccess());
    dispatch(getTransfersRequest());
    return {success: true};
  } else {
    dispatch(mutation.patientCreateFailure());
    return {success: false, message: data.message};
  }
};

export const updatePatientRequest = (id, payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.patientUpdateRequest());
  const {accessToken} = getState().user;
  const data = await Patient.updatePatient(id, payload, accessToken);
  if (data.success) {
    dispatch(mutation.patientUpdateSuccess());
    dispatch(getTransfersRequest());
    dispatch(getPatientRequest(id));
    return {success: true};
  } else {
    dispatch(mutation.patientUpdateFailure());
    return {success: false, message: data.message};
  }
};

export const activateDeactivateAccount = (id, enabled) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.activateDeactivateAccountRequest());
  const {accessToken} = getState().user;
  const data = await Patient.activateDeactivateAccount(id, accessToken, enabled);
  if (data.success) {
    dispatch(mutation.activateDeactivateAccountSuccess());
    return {success: true};
  } else {
    dispatch(mutation.activateDeactivateAccountFailure());
    return {success: false, message: data.message};
  }
};

export const deletePatientRequest = (id) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.patientDeleteRequest());
  const {accessToken} = getState().user;
  const data = await Patient.deletePatient(id, accessToken);
  if (data.success) {
    dispatch(mutation.patientDeleteSuccess(id));
    return {success: true};
  } else {
    dispatch(mutation.patientDeleteFailure());
    return {success: false, message: data.message};
  }
};

export const deletePendingSupplementary = (id) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.deletePendingSupplementaryRequest());
  const {accessToken} = getState().user;
  const data = await Patient.deletePendingSupplementary(id, accessToken);
  if (data.success) {
    dispatch(mutation.deletePendingSupplementarySuccess());
    return {success: true};
  } else {
    dispatch(mutation.deletePendingSupplementaryFailure());
    return {success: false, message: data.message};
  }
};
