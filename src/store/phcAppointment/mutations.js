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

const appointmentsWithTherapistWorkerFetchRequest = () => {
  return {
    type: 'APPOINTMENTS_WITH_THERAPIST_WORKER_FETCH_REQUESTED',
  };
};

const appointmentsWithTherapistWorkerFetchSuccess = (data, filters) => {
  return {
    type: 'APPOINTMENTS_WITH_THERAPIST_WORKER_FETCH_SUCCEED',
    data,
    filters,
  };
};

const appointmentsWithTherapistWorkerFetchFailure = () => {
  return {
    type: 'APPOINTMENTS_WITH_THERAPIST_WORKER_FETCH_FAILED',
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

const createAppointmentWithTherapistWorkerRequest = () => {
  return {
    type: 'CREATE_APPOINTMENT_WITH_THERAPIST_WORKER_REQUESTED',
  };
};

const createAppointmentWithTherapistWorkerSuccess = () => {
  return {
    type: 'CREATE_APPOINTMENT_WITH_THERAPIST_WORKER_SUCCEED',
  };
};

const createAppointmentWithTherapistWorkerFailure = () => {
  return {
    type: 'CREATE_APPOINTMENT_WITH_THERAPIST_WORKER_FAILED',
  };
};

const updateAppointmentWithTherapistWorkerRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_THERAPIST_WORKER_REQUESTED',
  };
};

const updateAppointmentWithTherapistWorkerSuccess = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_THERAPIST_WORKER_SUCCEED',
  };
};

const updateAppointmentWithTherapistWorkerFailure = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_THERAPIST_WORKER_FAILED',
  };
};

const deleteAppointmentWithTherapistWorkerRequest = () => {
  return {
    type: 'DELETE_APPOINTMENT_WITH_THERAPIST_WORKER_REQUESTED',
  };
};

const deleteAppointmentWithTherapistWorkerSuccess = () => {
  return {
    type: 'DELETE_APPOINTMENT_WITH_THERAPIST_WORKER_SUCCEEDED',
  };
};

const deleteAppointmentWithTherapistWorkerFailure = () => {
  return {
    type: 'DELETE_APPOINTMENT_WITH_THERAPIST_WORKER_FAILED',
  };
};

const acceptAppointmentWithTherapistWorkerRequest = () => {
  return {
    type: 'ACCEPT_APPOINTMENT_WITH_THERAPIST_WORKER_REQUESTED',
  };
};

const acceptAppointmentWithTherapistWorkerSuccess = () => {
  return {
    type: 'ACCEPT_APPOINTMENT_WITH_THERAPIST_WORKER_SUCCEED',
  };
};

const acceptAppointmentWithTherapistWorkerFailure = () => {
  return {
    type: 'ACCEPT_APPOINTMENT_WITH_THERAPIST_WORKER_FAILED',
  };
};

const declineAppointmentWithTherapistWorkerRequest = () => {
  return {
    type: 'DECLINE_APPOINTMENT_WITH_THERAPIST_WORKER_REQUESTED',
  };
};

const declineAppointmentWithTherapistWorkerSuccess = () => {
  return {
    type: 'DECLINE_APPOINTMENT_WITH_THERAPIST_WORKER_SUCCEED',
  };
};

const declineAppointmentWithTherapistWorkerFailure = () => {
  return {
    type: 'DECLINE_APPOINTMENT_WITH_THERAPIST_WORKER_FAILED',
  };
};

const updateAppointmentWithTherapistWorkerUnreadStatusRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_THERAPIST_WORKER_UNREAD_STATUS_REQUESTED',
  };
};

const updateAppointmentWithTherapistWorkerUnreadStatusSuccess = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_THERAPIST_WORKER_UNREAD_STATUS_SUCCEED',
  };
};

const updateAppointmentWithTherapistWorkerUnreadStatusFailure = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_THERAPIST_WORKER_UNREAD_STATUS_FAILED',
  };
};

const updateAppointmentWithPatientUnreadStatusRequest = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_UNREAD_STATUS_REQUESTED',
  };
};

const updateAppointmentWithPatientUnreadStatusSuccess = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_UNREAD_STATUS_SUCCEED',
  };
};

const updateAppointmentWithPatientUnreadStatusFailure = () => {
  return {
    type: 'UPDATE_APPOINTMENT_WITH_PATIENT_UNREAD_STATUS_FAILED',
  };
};

export const mutation = {
  appointmentsWithPatientFetchRequest,
  appointmentsWithPatientFetchSuccess,
  appointmentsWithPatientFetchFailure,
  appointmentsWithTherapistWorkerFetchRequest,
  appointmentsWithTherapistWorkerFetchSuccess,
  appointmentsWithTherapistWorkerFetchFailure,
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
  createAppointmentWithTherapistWorkerRequest,
  createAppointmentWithTherapistWorkerSuccess,
  createAppointmentWithTherapistWorkerFailure,
  updateAppointmentWithTherapistWorkerRequest,
  updateAppointmentWithTherapistWorkerSuccess,
  updateAppointmentWithTherapistWorkerFailure,
  deleteAppointmentWithTherapistWorkerRequest,
  deleteAppointmentWithTherapistWorkerSuccess,
  deleteAppointmentWithTherapistWorkerFailure,
  acceptAppointmentWithTherapistWorkerRequest,
  acceptAppointmentWithTherapistWorkerSuccess,
  acceptAppointmentWithTherapistWorkerFailure,
  declineAppointmentWithTherapistWorkerRequest,
  declineAppointmentWithTherapistWorkerSuccess,
  declineAppointmentWithTherapistWorkerFailure,
  updateAppointmentWithTherapistWorkerUnreadStatusRequest,
  updateAppointmentWithTherapistWorkerUnreadStatusSuccess,
  updateAppointmentWithTherapistWorkerUnreadStatusFailure,
  updateAppointmentWithPatientUnreadStatusRequest,
  updateAppointmentWithPatientUnreadStatusSuccess,
  updateAppointmentWithPatientUnreadStatusFailure,
};
