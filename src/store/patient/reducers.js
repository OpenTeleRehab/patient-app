/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const patient = (state = initialState, action) => {
  switch (action.type) {
    case 'PATIENTS_FOR_PHC_WORKER_FETCH_SUCCEED':
      return Object.assign({}, state, {
        patientsForPhcWorker: action.data,
        loading: false,
      });
    case 'PATIENTS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        patients: action.data,
        loading: false,
      });
    case 'PATIENTS_FOR_PHC_WORKER_FETCH_FAILED':
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
        loading: false,
      });
    case 'PATIENTS_FOR_PHC_WORKER_FETCH_REQUESTED':
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
        patients: state.patients.filter(
          (patientObj) => patientObj.id !== action.data,
        ),
        loading: false,
      };
    case 'FILTERS_UPDATE_SUCCEED':
      return Object.assign({}, state, {
        filters: action.data,
      });
    case 'ALL_PATIENTS_FETCH_SUCCEED':
      return Object.assign({}, state, {
        allPatients: action.data,
      });
    case 'REMOVE_PENDING_SUPPLEMENTARY_OFFLINE_SUCCEED':
      return Object.assign({}, state, {
        offlineRemovePendingSupplementary: [
          ...state.offlineRemovePendingSupplementary,
          action.data,
        ],
      });
    case 'SYNC_OFFLINE_REMOVE_PENDING_SUPPLEMENTARY_SUCCEED':
      return Object.assign({}, state, {
        offlineRemovePendingSupplementary: action.data,
      });
    default:
      return state;
  }
};
