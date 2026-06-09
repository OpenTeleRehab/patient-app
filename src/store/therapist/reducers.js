/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const therapist = (state = initialState, action) => {
  switch (action.type) {
    case 'THERAPIST_FETCH_SUCCEED':
      return Object.assign({}, state, {
        therapists: action.data,
      });
    case 'PHC_WORKER_FETCH_SUCCEED':
      return Object.assign({}, state, {
        phcWorkers: action.data,
      });
    case 'REFERRAL_THERAPISTS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        referralTherapists: action.data,
      });
    case 'PATIENT_PHC_WORKERS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        patientPhcWorkers: action.data,
      });
    default:
      return state;
  }
};
