/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const patient = (state = initialState, action) => {
  switch (action.type) {
    case 'PATIENTS_FETCH_SUCCEED':
      const allPatients = action.page === 1 ? action.data : [...state.patients, ...action.data];
      const map = {};
      allPatients.forEach(patientObj => {
        map[patientObj.id] = patientObj;
      });

      return {
        ...state,
        patients: Object.values(map),
        filters: action.filters,
        listInfo: action.info,
        loading: false,
      };
    case 'PATIENTS_FETCH_FAILED':
    case 'PATIENT_CREATE_FAILED':
    case 'PATIENT_UPDATE_FAILED':
    case 'PATIENT_DELETE_FAILED':
    case 'PATIENT_ACTIVATE_DEACTIVATE_ACCOUNT_FAILED':
    case 'PATIENT_CREATE_SUCCEED':
    case 'PATIENT_UPDATE_SUCCEED':
    case 'PATIENT_ACTIVATE_DEACTIVATE_ACCOUNT_SUCCEED':
      return Object.assign({}, state, {
        loading: false,
      });
    case 'PATIENT_FETCH_SUCCEED':
      return Object.assign({}, state, {
        patient: action.data,
      });
    case 'PATIENT_CREATE_REQUESTED':
    case 'PATIENT_UPDATE_REQUESTED':
    case 'PATIENT_DELETE_REQUESTED':
    case 'PATIENT_ACTIVATE_DEACTIVATE_ACCOUNT_REQUESTED':
      return Object.assign({}, state, {
        loading: true,
      });
    case 'PATIENT_DELETE_SUCCEED':
      return {
        ...state,
        patients: state.patients.filter(patientObj => patientObj.id !== action.data),
        loading: false,
      };
    default:
      return state;
  }
};
