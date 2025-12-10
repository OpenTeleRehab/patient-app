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
