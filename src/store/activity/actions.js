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
