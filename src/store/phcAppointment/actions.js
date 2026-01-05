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

export const getAppointmentsRequest = (payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.appointmentsFetchRequest());
  const {accessToken} = getState().user;
  const res = await PhcAppointment.getAppointments({...payload}, accessToken);
  if (res.success) {
    dispatch(mutation.appointmentsFetchSuccess(res.data, payload));
  } else {
    dispatch(mutation.appointmentsFetchFailure());
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
  const data = await PhcAppointment.deleteAppointmentWithPatient(id, accessToken);
  if (data.success) {
    dispatch(mutation.deleteAppointmentWithPatientSuccess());
    dispatch(getAppointmentsWithPatientRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.deleteAppointmentWithPatientFailure());
    return {success: false, message: data.message};
  }
};

export const createAppointment = (payload) => async (dispatch, getState) => {
  dispatch(mutation.createAppointmentRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.createAppointment(payload, accessToken);
  console.log('createAppointment data==', data);
  if (data.success) {
    dispatch(mutation.createAppointmentSuccess());
    dispatch(getAppointmentsRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.createAppointmentFailure());
    return {success: false, message: data.message};
  }
};

export const updateAppointment = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateAppointmentRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.updateAppointment(id, payload, accessToken);
  if (data.success) {
    dispatch(mutation.updateAppointmentSuccess());
    dispatch(getAppointmentsRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.updateAppointmentFailure());
    return {success: false, message: data.message};
  }
};

export const deleteAppointment = (id) => async (dispatch, getState) => {
  dispatch(mutation.deleteAppointmentRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.deleteAppointment(id, accessToken);
  if (data.success) {
    dispatch(mutation.deleteAppointmentSuccess());
    dispatch(getAppointmentsRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.deleteAppointmentFailure());
    return {success: false, message: data.message};
  }
};

export const acceptAppointment = (id) => async (dispatch, getState) => {
  dispatch(mutation.acceptAppointmentRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.acceptAppointment(id, accessToken);
  if (data.success) {
    dispatch(mutation.acceptAppointmentSuccess());
    dispatch(getAppointmentsRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.acceptAppointmentFailure());
    return {success: false, message: data.message};
  }
};

export const declineAppointment = (id) => async (dispatch, getState) => {
  dispatch(mutation.declineAppointmentRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.declineAppointment(id, accessToken);
  if (data.success) {
    dispatch(mutation.declineAppointmentSuccess());
    dispatch(getAppointmentsRequest(getState().phcAppointment.filters));
    return {success: true};
  } else {
    dispatch(mutation.declineAppointmentFailure());
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

export const updateAppointmentUnreadStatus = (payload) => async (dispatch, getState) => {
  dispatch(mutation.updateAppointmentUnreadStatusRequest());
  const {accessToken} = getState().user;
  const data = await PhcAppointment.updateAppointmentUnreadStatus(payload, accessToken);
  if (data.success) {
    dispatch(mutation.updateAppointmentUnreadStatusSuccess());
    return {success: true};
  } else {
    dispatch(mutation.updateAppointmentUnreadStatusFailure());
    return {success: false, message: data.message};
  }
};
