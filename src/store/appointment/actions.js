/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Appointment} from '../../services/appointment';
import {mutation} from './mutations';
import moment from 'moment';

export const getAppointmentsListRequest = (payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.appointmentFetchRequest());
  const now = moment().locale('en').format('YYYY-MM-DD HH:mm:ss');
  const {accessToken} = getState().user;
  const data = await Appointment.getAppointments(
    {...payload, now},
    accessToken,
  );
  if (data.success) {
    dispatch(mutation.appointmentFetchSuccess(data.data, data.info));
  } else {
    dispatch(mutation.appointmentFetchFailure());
  }
};
