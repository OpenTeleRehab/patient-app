/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Activity} from '../../services/activity';
import {mutation} from './mutations';

export const getActivityListRequest = () => async (dispatch) => {
  const data = await Activity.getActivities();
  if (data) {
    dispatch(mutation.activityFetchSuccess(data));
  } else {
    dispatch(mutation.activityFetchFailure());
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
  const {accessToken} = getState().user;
  const res = await Activity.completeActivity(id, payload, accessToken);
  if (res.success) {
    dispatch(mutation.completeActivitySuccess());
    return true;
  } else {
    dispatch(mutation.completeActivityFailure());
    return false;
  }
};
