/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */

export const CARE_PROVIDER_TYPES = {
  THERAPIST: 'therapist',
  PHC_WORKER: 'phc_worker',
};

export const CARE_PROVIDER_OPTIONS = [
  {
    label: 'appointment.phc_worker',
    value: CARE_PROVIDER_TYPES.PHC_WORKER,
  },
  {
    label: 'appointment.therapist',
    value: CARE_PROVIDER_TYPES.THERAPIST,
  },
];

export const PHC_APPOINTMENT_RECIPIENT_TYPE = {
  PATIENT: 'patient',
  PHC_WORKER: 'phc_worker',
  THERAPIST: 'therapist',
};

export const PHC_APPOINTMENT_OPTIONS = [
  {
    label: 'phc.appointment.patient',
    value: PHC_APPOINTMENT_RECIPIENT_TYPE.PATIENT,
  },
  {
    label: 'phc.appointment.phc_worker',
    value: PHC_APPOINTMENT_RECIPIENT_TYPE.PHC_WORKER,
  },
  {
    label: 'phc.appointment.therapist',
    value: PHC_APPOINTMENT_RECIPIENT_TYPE.THERAPIST,
  },
];
