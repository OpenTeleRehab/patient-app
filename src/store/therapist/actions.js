/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Therapist} from '../../services/therapist';
import {mutation} from './mutations';

export const getTherapistRequest = (payload) => async (dispatch, getState) => {
  dispatch(mutation.therapistFetchRequest);
  const data = await Therapist.getTherapists(payload);
  if (data.success) {
    dispatch(mutation.therapistFetchSuccess(data.data));
  } else {
    dispatch(mutation.therapistFetchFailure());
  }
};

export const getPhcWorkerRequest = () => async (dispatch, getState) => {
  dispatch(mutation.phcWorkerFetchRequest);
  const {accessToken} = getState().user;
  const data = await Therapist.getPhcWorkers(accessToken);
  if (data.success) {
    dispatch(mutation.phcWorkerFetchSuccess(data.data));
  } else {
    dispatch(mutation.phcWorkerFetchFailure());
  }
};

export const getReferralTherapistsRequest = () => async (dispatch, getState) => {
  dispatch(mutation.referralTherapistsFetchRequest);
  const {accessToken} = getState().user;
  const data = await Therapist.getReferralTherapists(accessToken);
  if (data.success) {
    dispatch(mutation.referralTherapistsFetchSuccess(data.data));
  } else {
    dispatch(mutation.referralTherapistsFetchFailure());
  }
};

export const getPatientPhcWorkersRequest = (payload) => async (dispatch) => {
  dispatch(mutation.patientPhcWorkersFetchRequest);
  const data = await Therapist.getPatientPhcWorkers(payload);
  if (data.success) {
    dispatch(mutation.patientPhcWorkersFetchSuccess(data.data));
  } else {
    dispatch(mutation.patientPhcWorkersFetchFailure());
  }
};
