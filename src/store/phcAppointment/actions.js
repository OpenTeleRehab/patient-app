/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {PhcAppointment} from '../../services/phcAppointment';
import {mutation} from './mutations';

export const getAppointmentsWithPatientRequest = (payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.appointmentsWithPatientFetchRequest());
  const {accessToken} = getState().user;
  const res = await PhcAppointment.getAppointmentsWithPatient({...payload}, accessToken);
  if (res.success) {
    dispatch(mutation.appointmentsWithPatientFetchSuccess(res.data, payload));
  } else {
    dispatch(mutation.appointmentsWithPatientFetchFailure());
  }
};

export const getAppointmentsWithTherapistWorkerRequest = (payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.appointmentsWithTherapistWorkerFetchRequest());
  const {accessToken} = getState().user;
  const res = await PhcAppointment.getAppointmentsWithTherapistWorker({...payload}, accessToken);
  if (res.success) {
    dispatch(mutation.appointmentsWithTherapistWorkerFetchSuccess(res.data, payload));
  } else {
    dispatch(mutation.appointmentsWithTherapistWorkerFetchFailure());
  }
};

export const createAppointmentWithPatient = (payload) => async (dispatch, getState) => {
  dispatch(mutation.createAppointmentWithPatientRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.createAppointmentWithPatient(payload, accessToken);
  if (data.success) {
    dispatch(mutation.createAppointmentWithPatientSuccess());
    dispatch(getAppointmentsWithPatientRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.createAppointmentWithPatientFailure());
    return {success: false, message: data.message};
  }
};

export const updateAppointmentWithPatient = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateAppointmentWithPatientRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.updateAppointmentWithPatient(id, payload, accessToken);
  if (data.success) {
    dispatch(mutation.updateAppointmentWithPatientSuccess());
    dispatch(getAppointmentsWithPatientRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.updateAppointmentWithPatientFailure());
    return {success: false, message: data.message};
  }
};

export const updateAppointmentWithPatientStatus = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateAppointmentWithPatientStatusRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.updateAppointmentWithPatientStatus(id, payload, accessToken);
  if (data.success) {
    dispatch(mutation.updateAppointmentWithPatientStatusSuccess());
    dispatch(getAppointmentsWithPatientRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.updateAppointmentWithPatientStatusFailure());
    return {success: false, message: data.message};
  }
};

export const deleteAppointmentWithPatient = (id) => async (dispatch, getState) => {
  dispatch(mutation.deleteAppointmentWithPatientRequest());
  const {accessToken} = getState().user;
  console.log('delete appointment data', id);
  const data = await PhcAppointment.deleteAppointmentWithPatient(id, accessToken);
  console.log('delete appointment data', data);
  if (data.success) {
    dispatch(mutation.deleteAppointmentWithPatientSuccess());
    dispatch(getAppointmentsWithPatientRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.deleteAppointmentWithPatientFailure());
    return {success: false, message: data.message};
  }
};

export const createAppointmentWithTherapistWorker = (payload) => async (dispatch, getState) => {
  dispatch(mutation.createAppointmentWithTherapistWorkerRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.createAppointmentWithTherapistWorker(payload, accessToken);
  if (data.success) {
    dispatch(mutation.createAppointmentWithTherapistWorkerSuccess());
    dispatch(getAppointmentsWithTherapistWorkerRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.createAppointmentWithTherapistWorkerFailure());
    return {success: false, message: data.message};
  }
};

export const updateAppointmentWithTherapistWorker = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateAppointmentWithTherapistWorkerRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.updateAppointmentWithTherapistWorker(id, payload, accessToken);
  if (data.success) {
    dispatch(mutation.updateAppointmentWithTherapistWorkerSuccess());
    dispatch(getAppointmentsWithTherapistWorkerRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.updateAppointmentWithTherapistWorkerFailure());
    return {success: false, message: data.message};
  }
};

export const deleteAppointmentWithTherapistWorker = (id) => async (dispatch, getState) => {
  dispatch(mutation.deleteAppointmentWithTherapistWorkerRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.deleteAppointmentWithTherapistWorker(id, accessToken);
  if (data.success) {
    dispatch(mutation.deleteAppointmentWithTherapistWorkerSuccess());
    dispatch(getAppointmentsWithTherapistWorkerRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.deleteAppointmentWithTherapistWorkerFailure());
    return {success: false, message: data.message};
  }
};

export const acceptAppointmentWithTherapistWorker = (id) => async (dispatch, getState) => {
  dispatch(mutation.acceptAppointmentWithTherapistWorkerRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.acceptAppointmentWithTherapistWorker(id, accessToken);
  if (data.success) {
    dispatch(mutation.acceptAppointmentWithTherapistWorkerSuccess());
    dispatch(getAppointmentsWithTherapistWorkerRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.acceptAppointmentWithTherapistWorkerFailure());
    return {success: false, message: data.message};
  }
};

export const declineAppointmentWithTherapistWorker = (id) => async (dispatch, getState) => {
  dispatch(mutation.declineAppointmentWithTherapistWorkerRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.declinedAppointmentWithTherapistWorker(id, accessToken);
  if (data.success) {
    dispatch(mutation.declineAppointmentWithTherapistWorkerSuccess());
    dispatch(getAppointmentsWithTherapistWorkerRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.declineAppointmentWithTherapistWorkerFailure());
    return {success: false, message: data.message};
  }
};

export const updateAppointmentWithPatientUnreadStatus = (payload) => async (dispatch, getState) => {
  dispatch(mutation.updateAppointmentWithPatientUnreadStatusRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.updateAppointmentWithPatientUnreadStatus(payload, accessToken);
  if (data.success) {
    dispatch(mutation.updateAppointmentWithPatientUnreadStatusSuccess());
    return {success: true};
  } else {
    dispatch(mutation.updateAppointmentWithPatientUnreadStatusFailure());
    return {success: false, message: data.message};
  }
};

export const updateAppointmentWithTherapistWorkerUnreadStatus = (payload) => async (dispatch, getState) => {
  dispatch(mutation.updateAppointmentWithTherapistWorkerUnreadStatusRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.updateAppointmentWithTherapistWorkerUnreadStatus(payload, accessToken);
  if (data.success) {
    dispatch(mutation.updateAppointmentWithTherapistWorkerUnreadStatusSuccess());
    return {success: true};
  } else {
    dispatch(mutation.updateAppointmentWithTherapistWorkerUnreadStatusFailure());
    return {success: false, message: data.message};
  }
};
