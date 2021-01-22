/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Activity} from '../../services/activity';
import {mutation} from './mutations';
import moment from 'moment';
import settings from '../../../config/settings';

export const getTreatmentPlanRequest = () => async (dispatch, getState) => {
  dispatch(mutation.treatmentPlanFetchRequest);
  const {accessToken} = getState().user;
  const today = moment().format(settings.format.date);
  const data = await Activity.getTreatmentPlan(today, accessToken);
  if (data.success) {
    dispatch(mutation.treatmentPlanFetchSuccess(data.data));
  } else {
    dispatch(mutation.treatmentPlanFetchFailure());
  }
};

export const getTodayActivitySummaryRequest = () => async (dispatch) => {
  const data = await Activity.getTodayActivitySummary();
  if (data.success) {
    dispatch(mutation.todayActivitySummarySuccess(data.data));
  } else {
    dispatch(mutation.todayActivitySummaryFailure());
  }
};

export const completeActive = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.completeActivityRequest());
  const {accessToken, profile} = getState().user;
  const res = await Activity.completeActivity(id, payload, accessToken);
  if (res.success) {
    getTreatmentPlanRequest(profile.id);
    dispatch(mutation.completeActivitySuccess());
    return true;
  } else {
    dispatch(mutation.completeActivityFailure());
    return false;
  }
};
