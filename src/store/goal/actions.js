/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Goal} from '../../services/goal';
import {mutation} from './mutations';

export const getGoalListRequest = () => async (dispatch) => {
  const data = await Goal.getGoals();
  if (data) {
    dispatch(mutation.goalFetchSuccess(data));
  } else {
    dispatch(mutation.goalFetchFailure());
  }
};
