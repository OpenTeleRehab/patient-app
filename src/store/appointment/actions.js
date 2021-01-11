/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Appointment} from '../../services/appointment';
import {mutation} from './mutations';

export const getAppointmentListRequest = () => async (dispatch) => {
  const data = await Appointment.getAppointments();
  if (data) {
    dispatch(mutation.appointmentFetchSuccess(data));
  } else {
    dispatch(mutation.appointmentFetchFailure());
  }
};
