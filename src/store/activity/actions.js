/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Activity} from '../../services/activity';
import {mutation} from './mutations';
import moment from 'moment';
import settings from '../../../config/settings';
import _ from 'lodash';

export const getTreatmentPlanRequest = () => async (dispatch, getState) => {
  dispatch(mutation.treatmentPlanFetchRequest());
  const {accessToken} = getState().user;
  const {language} = getState().translation;
  const today = moment().format(settings.format.date);
  const data = await Activity.getTreatmentPlan(today, accessToken, language);
  if (data.success) {
    dispatch(mutation.treatmentPlanFetchSuccess(data.data));
  } else {
    dispatch(mutation.treatmentPlanFetchFailure());
  }
};

/**
 * @deprecated It is wrong with goal activity count,
 * use getTreatmentPlanRequest() instead of, then count them
 * @returns {(function(*, *): Promise<void>)|*}
 */
export const getTodayActivitySummaryRequest = () => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.todayActivitySummaryRequest());
  const {accessToken} = getState().user;
  const today = moment().format(settings.format.date);
  const data = await Activity.getTodayActivitySummary(today, accessToken);
  if (data.success) {
    dispatch(mutation.todayActivitySummarySuccess(data.data));
  } else {
    dispatch(mutation.todayActivitySummaryFailure());
  }
};

export const completeActive = (id, payload) => async (dispatch, getState) => {
  dispatch(mutation.completeActivityRequest());
  const {accessToken} = getState().user;
  let offlineActivities = _.cloneDeep(getState().activity.offlineActivities);
  _.remove(offlineActivities, {id});
  const res = await Activity.completeActivity(id, payload, accessToken);
  if (res.success) {
    dispatch(mutation.completeActivityOfflineSuccess(offlineActivities));
    dispatch(getTreatmentPlanRequest());
    dispatch(mutation.completeActivitySuccess());
    return true;
  } else {
    dispatch(mutation.completeActivityFailure());
    return false;
  }
};

export const completeQuestionnaire = (id, payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.completeQuestionnaireRequest());
  const {accessToken} = getState().user;
  let offlineQuestionnaireAnswers = _.cloneDeep(
    getState().activity.offlineQuestionnaireAnswers,
  );
  _.remove(offlineQuestionnaireAnswers, {id});
  const res = await Activity.completeQuestionnaire(id, payload, accessToken);
  if (res.success) {
    dispatch(
      mutation.completeQuestionnaireOfflineSuccess(offlineQuestionnaireAnswers),
    );
    dispatch(getTreatmentPlanRequest());
    dispatch(mutation.completeQuestionnaireSuccess());
    return true;
  } else {
    dispatch(mutation.completeQuestionnaireFailure());
    return false;
  }
};

export const completeQuestionnaireOffline = (data) => async (dispatch) => {
  dispatch(mutation.completeQuestionnaireOfflineSuccess(data));
};

export const completeGoal = (payload) => async (dispatch, getState) => {
  dispatch(mutation.completeGoalRequest());
  const {accessToken} = getState().user;
  const res = await Activity.completeGoal(payload, accessToken);
  if (res.success) {
    dispatch(getTreatmentPlanRequest());
    dispatch(mutation.completeGoalSuccess());
    return true;
  } else {
    dispatch(mutation.completeGoalFailure());
    return false;
  }
};

export const completeGoalOffline = (data) => async (dispatch) => {
  dispatch(mutation.completeGoalOfflineSuccess(data));
};

export const completeActivityOffline = (data) => async (dispatch) => {
  dispatch(mutation.completeActivityOfflineSuccess(data));
};
