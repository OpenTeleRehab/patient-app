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
      try {
        const {patientsForPhcWorker} = getState().patient;
        const needActionPatients =
          patientsForPhcWorker?.filter(
            (item) => item.status && item.status !== 'success',
          ) || [];
        dispatch(
          mutation.patientsForPhcWorkerFetchSuccess([
            ...needActionPatients,
            ...res.data.filter((item) => {
              if (!needActionPatients.length) return true;
              const found = needActionPatients.find(
                (p) => p.id === item.id && p.status === 'duplicate-update',
              );
              if (found) return false;
              return true;
            }),
          ]),
        );
      } catch (error) {
        console.log('erro', error);
      }
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

export const updatePatientOfflineRequest =
  (id, payload) => async (dispatch, getState) => {
    const {patientsForPhcWorker} = getState().patient;
    //1. Find Patient by Patient ID
    //2. Check Status of Patiend Detail
    //3. Replace Data Patient Detail
    //4. Change State of Patient Detail by check if Status pending-crate so just replace data and no change but if not change status to pending-update
    const filterOutPatientUpdate = patientsForPhcWorker?.filter(
      (item) => item.id !== id,
    );

    const findPatientByPatientId = patientsForPhcWorker?.find(
      (item) => item.id === id,
    );

    if (findPatientByPatientId.status === 'pending-create') {
      const newData = [payload, ...filterOutPatientUpdate];
      dispatch(mutation.patientsForPhcWorkerFetchSuccess(newData));
    } else {
      const newData = [
        {...payload, status: 'pending-update'},
        ...filterOutPatientUpdate,
      ];
      dispatch(mutation.patientsForPhcWorkerFetchSuccess(newData));
    }
  };

export const createPatientOfflineRequest =
  (payload) => async (dispatch, getState) => {
    const {patientsForPhcWorker} = getState().patient;
    const localId = uuid.v4();
    const data = {...payload, id: localId, status: 'pending-create'};
    const newData = [data, ...patientsForPhcWorker];
    dispatch(mutation.patientsForPhcWorkerFetchSuccess(newData));
  };

export const syncPatientOffline = (payload) => async (dispatch, getState) => {
  const {patientsForPhcWorker} = getState().patient;
  const {offlineInterviews} = getState().screeningQuestionnaire;

  const offlinePatients = patientsForPhcWorker.filter(
    (item) =>
      item.status === 'pending-create' || item.status === 'pending-update',
  );
  if (offlinePatients?.length > 0) {
    await dispatch(syncOfflineCreatePatient(offlinePatients));
  }

  if (offlineInterviews?.length > 0) {
    const qn = getState().screeningQuestionnaire;
    await dispatch(syncOfflineScreeningQuestionnaires(qn.offlineInterviews));
  }

  if (offlinePatients.length > 0 || offlineInterviews.length > 0) {
    dispatch(getPatientsListForPhcWorkerRequest());
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
    return {success: true, data: data.data};
  } else {
    dispatch(mutation.patientCreateFailure());
    return {success: false, message: data.message};
  }
};

//Async Create Patient Offline syncOfflineScreeningQuestionnaires
export const updateListItem = (list, compare, payload) => {
  return list.map((item) => {
    if (compare(item)) {
      return {
        ...item,
        ...payload,
      };
    }
    return item;
  });
};

export const syncOfflineCreatePatient =
  (offlinePatients) => async (dispatch, getState) => {
    const {offlineInterviews} = getState().screeningQuestionnaire;
    const {accessToken} = getState().user;

    for (const item of offlinePatients) {
      const {patientsForPhcWorker} = getState().patient;

      try {
        // validate duplicate and set status duplicate
        const response = await dispatch(
          getPatientByPhoneRequest(
            item.phone,
            item.status === 'pending-update' ? item.id : null,
          ),
        );
        if (response.success) {
          if (response.data) {
            const updatePatientList = updateListItem(
              patientsForPhcWorker,
              (patient) => patient.id === item.id,
              {
                status: item.status.replace('pending', 'duplicate'),
              },
            );
            await dispatch(
              mutation.patientsForPhcWorkerFetchSuccess(updatePatientList),
            );
            if (
              offlineInterviews?.length > 0 &&
              item.status.include('create')
            ) {
              const updateOfflineInterviews = updateListItem(
                offlineInterviews,
                (interview) => interview.userId === item.id,
                {
                  status: 'user-duplicate',
                },
              );
              await dispatch(
                questionnaireMutation.submitScreeningQuestionnaireOfflineSuccess(
                  updateOfflineInterviews,
                ),
              );
            }
          } else {
            if (item.status === 'pending-update') {
              await Patient.updatePatient(item.id, item, accessToken);
              const updatedPatient = updateListItem(
                patientsForPhcWorker,
                (patient) => patient.id === item.id,
                {
                  status: 'success',
                },
              );
              await dispatch(
                mutation.patientsForPhcWorkerFetchSuccess(updatedPatient),
              );
            } else {
              const res = await Patient.createPatient(
                {...item, phc_service_identity: getPhcServiceIdentity()},
                accessToken,
              );
              if (res.success) {
                if (offlineInterviews?.length > 0) {
                  const updateOfflineInterviews = updateListItem(
                    offlineInterviews,
                    (interview) => interview.userId === item.id,
                    {userId: res.data.id},
                  );
                  await dispatch(
                    questionnaireMutation.submitScreeningQuestionnaireOfflineSuccess(
                      updateOfflineInterviews,
                    ),
                  );
                }
                const updatedPatient = updateListItem(
                  patientsForPhcWorker,
                  (patient) => patient.id === item.id,
                  {
                    status: 'success',
                    id: res.data.id,
                  },
                );
                await dispatch(
                  mutation.patientsForPhcWorkerFetchSuccess(updatedPatient),
                );
              }
            }
          }
        }
      } catch (e) {
        console.log('Failed to asnc offline Patient', e);
      }
    }
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

export const getPatientsByIds = (payload) => async (dispatch, getState) => {
  const {accessToken} = getState().user;
  const data = await Patient.getPatientsByIds(payload, accessToken);
  if (data.success) {
    return data.data;
  } else {
    return null;
  }
};
