/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Achievement} from '../../services/achievement';
import {mutation} from './mutations';

export const getAchievementRequest = () => async (dispatch, getState) => {
  dispatch(mutation.achievementFetchRequest);
  const {accessToken} = getState().user;
  const res = await Achievement.getAchievements(accessToken);
  if (res.success) {
    dispatch(mutation.achievementFetchSuccess(res.data));
  } else {
    dispatch(mutation.achievementFetchFailure());
  }
};
