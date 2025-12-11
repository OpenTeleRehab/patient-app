/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const patient = (state = initialState, action) => {
  switch (action.type) {
    case 'PATIENTS_FETCH_SUCCEED':
      const allPatients = [...state.patients, ...action.data];
      const map = {};
      allPatients.forEach(patientObj => {
        map[patientObj.id] = patientObj;
      });

      return {
        ...state,
        patients: Object.values(map),
        listInfo: action.info,
        loading: false,
      };
    case 'PATIENTS_FETCH_FAILED':
      return Object.assign({}, state, {
        loading: false,
      });
    case 'PATIENT_FETCH_SUCCEED':
      return Object.assign({}, state, {
        patient: action.data,
      });
    default:
      return state;
  }
};
