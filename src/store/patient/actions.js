/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Patient} from '../../services/patient';
import {mutation} from './mutations';
import {mutation as questionnaireMutation} from '../screeningQuestionnaire/mutations';
import {getPhcServiceIdentity} from '../../utils/patient';
import {getTransfersRequest} from '../transfer/actions';
import uuid from 'react-native-uuid';
import {syncOfflineScreeningQuestionnaires} from '../screeningQuestionnaire/actions';

export const getPatientsListForPhcWorkerRequest =
  () => async (dispatch, getState) => {
    dispatch(mutation.patientsForPhcWorkerFetchRequest());
    const {accessToken} = getState().user;
    const res = await Patient.getPatientsForPhcWorker(accessToken);
    if (res.success) {
      dispatch(mutation.patientsForPhcWorkerFetchSuccess(res.data));
    } else {
      dispatch(mutation.patientsForPhcWorkerFetchFailure());
    }
  };

export const getPatientsListRequest = () => async (dispatch, getState) => {
  dispatch(mutation.patientsFetchRequest());
  const {accessToken} = getState().user;
  const res = await Patient.getPatients(accessToken);
  if (res.success) {
    dispatch(mutation.patientsFetchSuccess(res.data));
  } else {
    dispatch(mutation.patientsFetchFailure());
  }
};

export const getAllPatientsRequest =
  (payload) => async (dispatch, getState) => {
    dispatch(mutation.allPatientsFetchRequest());
    const {accessToken} = getState().user;
    const res = await Patient.getAllPatients(payload, accessToken);
    if (res.success) {
      dispatch(mutation.allPatientsFetchSuccess(res.data));
    } else {
      dispatch(mutation.allPatientsFetchFailure());
    }
  };

export const getPatientRequest = (id) => async (dispatch, getState) => {
  dispatch(mutation.patientFetchRequest());
  const {accessToken} = getState().user;
  const data = await Patient.getPatient(id, accessToken);
  if (data) {
    dispatch(mutation.patientFetchSuccess(data));
  } else {
    dispatch(mutation.patientFetchFailure());
  }
};

export const getPatientByPhoneRequest =
  (phone, patientId) => async (dispatch, getState) => {
    dispatch(mutation.patientByPhoneFetchRequest());
    const {accessToken} = getState().user;
    const data = await Patient.getPatientByPhoneNumber(
      phone,
      accessToken,
      patientId,
    );
    if (data.success) {
      dispatch(mutation.patientByPhoneFetchSuccess());
      return {success: true, data: data.data};
    } else {
      dispatch(mutation.patientByPhoneFetchFailure());
      return {success: false, message: data.message};
    }
  };

export const createPatientOfflineRequest =
  (payload) => async (dispatch, getState) => {
    const {patientsForPhcWorker} = getState().patient;
    const localId = uuid.v4();
    const data = {...payload, id: localId, status: 'pending'};
    const newData = [...patientsForPhcWorker, data];
    dispatch(mutation.patientsForPhcWorkerFetchSuccess(newData));
  };

export const syncPatientOffline = (payload) => async (dispatch, getState) => {
  const {patientsForPhcWorker} = getState().patient;
  const {offlineInterviews} = getState().screeningQuestionnaire;

  const offlinePatients = patientsForPhcWorker.filter(
    (item) => item.status === 'pending',
  );
  if (offlinePatients?.length > 0) {
    await dispatch(syncOfflineCreatePatient(offlinePatients));
  }

  if (offlineInterviews?.length > 0) {
    const qn = getState().screeningQuestionnaire;

    await dispatch(syncOfflineScreeningQuestionnaires(qn.offlineInterviews));
  }
};

export const createPatientRequest = (payload) => async (dispatch, getState) => {
  dispatch(mutation.patientCreateRequest());
  const {accessToken} = getState().user;
  const data = await Patient.createPatient(
    {...payload, phc_service_identity: getPhcServiceIdentity()},
    accessToken,
  );
  if (data.success) {
    dispatch(mutation.patientCreateSuccess());
    dispatch(getTransfersRequest());
    return {success: true};
  } else {
    dispatch(mutation.patientCreateFailure());
    return {success: false, message: data.message};
  }
};

//Async Create Patient Offline syncOfflineScreeningQuestionnaires

export const syncOfflineCreatePatient =
  (offlinePatients) => async (dispatch, getState) => {
    const {patientsForPhcWorker} = getState().patient;
    const {offlineInterviews} = getState().screeningQuestionnaire;
    const {accessToken} = getState().user;

    for (const item of offlinePatients) {
      try {
        const res = await Patient.createPatient(
          {...item, phc_service_identity: getPhcServiceIdentity()},
          accessToken,
        );
        if (res.success) {
          if (offlineInterviews?.length > 0) {
            const offlineInterviewsUpdated = offlineInterviews.map(
              (interview) => {
                if (interview.userId === item.id) {
                  return {
                    ...interview,
                    userId: res.data.id,
                  };
                }
                return interview;
              },
            );
            dispatch(
              questionnaireMutation.submitScreeningQuestionnaireOfflineSuccess(
                offlineInterviewsUpdated,
              ),
            );
          }
          const patientUpdated = patientsForPhcWorker.map((patient) => {
            if (patient.id === item.id) {
              return {
                ...patient,
                status: 'sucess',
                id: res.data.id,
              };
            }
            return patient;
          });
          dispatch(mutation.patientsForPhcWorkerFetchSuccess(patientUpdated));
        }
      } catch (e) {
        console.log('Failed to asnc offline Patient', e);
      }
    }
    dispatch(getPatientsListForPhcWorkerRequest());
  };

export const updatePatientRequest =
  (id, payload) => async (dispatch, getState) => {
    dispatch(mutation.patientUpdateRequest());
    const {accessToken} = getState().user;
    const data = await Patient.updatePatient(id, payload, accessToken);
    if (data.success) {
      dispatch(mutation.patientUpdateSuccess());
      dispatch(getTransfersRequest());
      dispatch(getPatientRequest(id));
      return {success: true};
    } else {
      dispatch(mutation.patientUpdateFailure());
      return {success: false, message: data.message};
    }
  };

export const activateDeactivateAccount =
  (id, enabled) => async (dispatch, getState) => {
    dispatch(mutation.activateDeactivateAccountRequest());
    const {accessToken} = getState().user;
    const data = await Patient.activateDeactivateAccount(
      id,
      accessToken,
      enabled,
    );
    if (data.success) {
      dispatch(mutation.activateDeactivateAccountSuccess());
      return {success: true};
    } else {
      dispatch(mutation.activateDeactivateAccountFailure());
      return {success: false, message: data.message};
    }
  };

export const deletePatientRequest = (id) => async (dispatch, getState) => {
  dispatch(mutation.patientDeleteRequest());
  const {accessToken} = getState().user;
  const data = await Patient.deletePatient(id, accessToken);
  if (data.success) {
    dispatch(mutation.patientDeleteSuccess(id));
    return {success: true};
  } else {
    dispatch(mutation.patientDeleteFailure());
    return {success: false, message: data.message};
  }
};

export const deletePendingSupplementary =
  (id) => async (dispatch, getState) => {
    dispatch(mutation.deletePendingSupplementaryRequest());
    const {accessToken} = getState().user;
    const data = await Patient.deletePendingSupplementary(id, accessToken);
    if (data.success) {
      dispatch(mutation.deletePendingSupplementarySuccess());
      return {success: true};
    } else {
      dispatch(mutation.deletePendingSupplementaryFailure());
      return {success: false, message: data.message};
    }
  };

export const updateFilters = (payload) => (dispatch) => {
  dispatch(mutation.filtersUpdateSuccess(payload));
};
