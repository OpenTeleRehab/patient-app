/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Appointment} from '../../services/appointment';
import {mutation} from './mutations';
import moment from 'moment';

// One size for every caller: pages are offset-based, so mixing sizes makes appended pages overlap
const PAGE_SIZE = 10;
let latestListRequestId = 0;

export const getAppointmentsListRequest = (payload) => async (
  dispatch,
  getState,
) => {
  const requestId = ++latestListRequestId;
  dispatch(mutation.appointmentFetchRequest());
  const now = moment.utc().locale('en').format('YYYY-MM-DD HH:mm:ss');
  const {accessToken} = getState().user;
  const res = await Appointment.getAppointments(
    {page_size: PAGE_SIZE, ...payload, now},
    accessToken,
  );
  // A newer request (e.g. a reload of page 1) supersedes this one; it will set the list and loading
  if (requestId !== latestListRequestId) {
    return;
  }
  if (res.success) {
    let data = res.data;
    if (payload.page > 1) {
      const {appointments} = getState().appointment;
      data = [...appointments, ...data];
    }
    dispatch(mutation.appointmentFetchSuccess(data, res.info));
  } else {
    dispatch(mutation.appointmentFetchFailure());
  }
};

export const requestAppointment = (payload) => async (dispatch, getState) => {
  dispatch(mutation.appointmentRequestRequest());
  const {accessToken} = getState().user;
  const data = await Appointment.requestAppointment(payload, accessToken);
  if (data.success) {
    dispatch(mutation.appointmentRequestSuccess());
    return {success: true};
  } else {
    dispatch(mutation.appointmentRequestFailure());
    return {success: false, message: data.message};
  }
};

export const updateStatus = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.updateStatusRequest());
  const {accessToken} = getState().user;
  const data = await Appointment.updateStatus(id, payload, accessToken);
  if (data.success) {
    dispatch(mutation.updateStatusSuccess());
    dispatch(getAppointmentsListRequest({page: 1}));
    return true;
  } else {
    dispatch(mutation.updateStatusFailure());
    return false;
  }
};

export const deleteAppointment = (id) => async (dispatch, getState) => {
  dispatch(mutation.deleteAppointmentRequest());
  const {accessToken} = getState().user;
  const data = await Appointment.deleteAppointment(id, accessToken);
  if (data.success) {
    dispatch(mutation.appointmentRequestSuccess());
    return true;
  } else {
    dispatch(mutation.appointmentRequestFailure());
    return false;
  }
};
