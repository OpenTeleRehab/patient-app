/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const appointmentsWithPatientFetchRequest = () => {
  return {
    type: 'APPOINTMENTS_WITH_PATIENT_FETCH_REQUESTED',
  };
};

const appointmentsWithPatientFetchSuccess = (data, filters) => {
  return {
    type: 'APPOINTMENTS_WITH_PATIENT_FETCH_SUCCEED',
    data,
    filters,
  };
};

const appointmentsWithPatientFetchFailure = () => {
  return {
    type: 'APPOINTMENTS_WITH_PATIENT_FETCH_FAILED',
  };
};

const appointmentsFetchRequest = () => {
  return {
    type: 'APPOINTMENTS_FETCH_REQUESTED',
  };
};

const appointmentsFetchSuccess = (data, filters) => {
  return {
    type: 'APPOINTMENTS_FETCH_SUCCEED',
    data,
    filters,
  };
};

const appointmentsFetchFailure = () => {
  return {
    type: 'APPOINTMENTS_FETCH_FAILED',
  };
};

const createAppointmentWithPatientRequest = () => {
  return {
    type: 'CREATE_APPOINTMENT_WITH_PATIENT_REQUESTED',
  };
};

const createAppointmentWithPatientSuccess = () => {
  return {
    type: 'CREATE_APPOINTMENT_WITH_PATIENT_SUCCEED',
  };
};

const createAppointmentWithPatientFailure = () => {
  return {
    type: 'CREATE_APPOINTMENT_WITH_PATIENT_FAILED',
  };
};

const updateAppointmentWithPatientStatusRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_STATUS_REQUESTED',
  };
};

const updateAppointmentWithPatientStatusSuccess = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_STATUS_SUCCEED',
  };
};

const updateAppointmentWithPatientStatusFailure = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_STATUS_FAILED',
  };
};

const updateAppointmentWithPatientRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_REQUESTED',
  };
};

const updateAppointmentWithPatientSuccess = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_SUCCEED',
  };
};

const updateAppointmentWithPatientFailure = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_FAILED',
  };
};

const deleteAppointmentWithPatientRequest = () => {
  return {
    type: 'DELETE_APPOINTMENT_WITH_PATIENT_REQUESTED',
  };
};

const deleteAppointmentWithPatientSuccess = () => {
  return {
    type: 'DELETE_APPOINTMENT_WITH_PATIENT_SUCCEEDED',
  };
};

const deleteAppointmentWithPatientFailure = () => {
  return {
    type: 'DELETE_APPOINTMENT_WITH_PATIENT_FAILED',
  };
};

const createAppointmentRequest = () => {
  return {
    type: 'CREATE_APPOINTMENT_REQUESTED',
  };
};

const createAppointmentSuccess = () => {
  return {
    type: 'CREATE_APPOINTMENT_SUCCEED',
  };
};

const createAppointmentFailure = () => {
  return {
    type: 'CREATE_APPOINTMENT_FAILED',
  };
};

const updateAppointmentRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_REQUESTED',
  };
};

const updateAppointmentSuccess = () => {
  return {
    type: 'UPDATE_APPOINTMENT_SUCCEED',
  };
};

const updateAppointmentFailure = () => {
  return {
    type: 'UPDATE_APPOINTMENT_FAILED',
  };
};

const deleteAppointmentRequest = () => {
  return {
    type: 'DELETE_APPOINTMENT_REQUESTED',
  };
};

const deleteAppointmentSuccess = () => {
  return {
    type: 'DELETE_APPOINTMENT_SUCCEEDED',
  };
};

const deleteAppointmentFailure = () => {
  return {
    type: 'DELETE_APPOINTMENT_FAILED',
  };
};

const acceptAppointmentRequest = () => {
  return {
    type: 'ACCEPT_APPOINTMENT_REQUESTED',
  };
};

const acceptAppointmentSuccess = () => {
  return {
    type: 'ACCEPT_APPOINTMENT_SUCCEED',
  };
};

const acceptAppointmentFailure = () => {
  return {
    type: 'ACCEPT_APPOINTMENT_FAILED',
  };
};

const declineAppointmentRequest = () => {
  return {
    type: 'DECLINE_APPOINTMENT_REQUESTED',
  };
};

const declineAppointmentSuccess = () => {
  return {
    type: 'DECLINE_APPOINTMENT_SUCCEED',
  };
};

const declineAppointmentFailure = () => {
  return {
    type: 'DECLINE_APPOINTMENT_FAILED',
  };
};

const updateAppointmentUnreadStatusRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_UNREAD_STATUS_REQUESTED',
  };
};

const updateAppointmentUnreadStatusSuccess = () => {
  return {
    type: 'UPDATE_APPOINTMENT_UNREAD_STATUS_SUCCEED',
  };
};

const updateAppointmentUnreadStatusFailure = () => {
  return {
    type: 'UPDATE_APPOINTMENT_UNREAD_STATUS_FAILED',
  };
};

const updateAppointmentWithPatientUnreadStatusRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_UNREAD_STATUS_REQUESTED',
  };
};

const updateAppointmentWithPatientUnreadStatusSuccess = () => {
  return {
    type: 'UPDATE_APPOINTMENT_UNREAD_STATUS_SUCCEED',
  };
};

const updateAppointmentWithPatientUnreadStatusFailure = () => {
  return {
    type: 'UPDATE_APPOINTMENT_UNREAD_STATUS_FAILED',
  };
};

export const mutation = {
  appointmentsWithPatientFetchRequest,
  appointmentsWithPatientFetchSuccess,
  appointmentsWithPatientFetchFailure,
  appointmentsFetchRequest,
  appointmentsFetchSuccess,
  appointmentsFetchFailure,
  createAppointmentWithPatientRequest,
  createAppointmentWithPatientSuccess,
  createAppointmentWithPatientFailure,
  updateAppointmentWithPatientStatusRequest,
  updateAppointmentWithPatientStatusSuccess,
  updateAppointmentWithPatientStatusFailure,
  updateAppointmentWithPatientRequest,
  updateAppointmentWithPatientSuccess,
  updateAppointmentWithPatientFailure,
  deleteAppointmentWithPatientRequest,
  deleteAppointmentWithPatientSuccess,
  deleteAppointmentWithPatientFailure,
  createAppointmentRequest,
  createAppointmentSuccess,
  createAppointmentFailure,
  updateAppointmentRequest,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  deleteAppointmentRequest,
  deleteAppointmentSuccess,
  deleteAppointmentFailure,
  acceptAppointmentRequest,
  acceptAppointmentSuccess,
  acceptAppointmentFailure,
  declineAppointmentRequest,
  declineAppointmentSuccess,
  declineAppointmentFailure,
  updateAppointmentUnreadStatusRequest,
  updateAppointmentUnreadStatusSuccess,
  updateAppointmentUnreadStatusFailure,
  updateAppointmentWithPatientUnreadStatusRequest,
  updateAppointmentWithPatientUnreadStatusSuccess,
  updateAppointmentWithPatientUnreadStatusFailure,
};
