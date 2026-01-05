/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const phcAppointment = (state = initialState, action) => {
  switch (action.type) {
    case 'APPOINTMENTS_WITH_PATIENT_FETCH_REQUESTED':
    case 'CREATE_APPOINTMENT_WITH_PATIENT_REQUESTED':
    case 'UPDATE_APPOINTMENT_WITH_PATIENT_STATUS_REQUESTED':
    case 'UPDATE_APPOINTMENT_WITH_PATIENT_REQUESTED':
    case 'APPOINTMENTS_FETCH_REQUESTED':
    case 'CREATE_APPOINTMENT_REQUESTED':
    case 'UPDATE_APPOINTMENT_STATUS_REQUESTED':
    case 'UPDATE_APPOINTMENT_REQUESTED':
    case 'ACCEPT_APPOINTMENT_REQUESTED':
    case 'DECLINE_APPOINTMENT_REQUESTED':
      return Object.assign({}, state, {
        loading: true,
      });
    case 'APPOINTMENTS_WITH_PATIENT_FETCH_SUCCEED':
      return Object.assign({}, state, {
        phcAppointmentsWithPatient: action.data,
        filters: action.filters,
        loading: false,
      });
    case 'APPOINTMENTS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        phcAppointments: action.data,
        filters: action.filters,
        loading: false,
      });
    case 'APPOINTMENTS_WITH_PATIENT_FETCH_FAILED':
    case 'UPDATE_APPOINTMENT_WITH_PATIENT_STATUS_SUCCEED':
    case 'UPDATE_APPOINTMENT_WITH_PATIENT_STATUS_FAILED':
    case 'CREATE_APPOINTMENT_WITH_PATIENT_SUCCEED':
    case 'CREATE_APPOINTMENT_WITH_PATIENT_FAILED':
    case 'UPDATE_APPOINTMENT_WITH_PATIENT_SUCCEED':
    case 'UPDATE_APPOINTMENT_WITH_PATIENT_FAILED':
    case 'APPOINTMENTS_FETCH_SUCCEED':
    case 'APPOINTMENTS_FETCH_FAILED':
    case 'UPDATE_APPOINTMENT_STATUS_SUCCEED':
    case 'UPDATE_APPOINTMENT_STATUS_FAILED':
    case 'CREATE_APPOINTMENT_SUCCEED':
    case 'CREATE_APPOINTMENT_FAILED':
    case 'UPDATE_APPOINTMENT_SUCCEED':
    case 'UPDATE_APPOINTMENT_FAILED':
    case 'ACCEPT_APPOINTMENT_SUCCEED':
    case 'ACCEPT_APPOINTMENT_FAILED':
    case 'DECLINE_APPOINTMENT_SUCCEED':
    case 'DECLINE_APPOINTMENT_FAILED':
      return Object.assign({}, state, {
        loading: false,
      });
    default:
      return state;
  }
};
