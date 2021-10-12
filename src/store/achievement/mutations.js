/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const achievementFetchRequest = () => {
  return {
    type: 'ACHIEVEMENT_FETCH_REQUESTED',
  };
};
const achievementFetchSuccess = (data) => {
  return {
    type: 'ACHIEVEMENT_FETCH_SUCCEED',
    data,
  };
};

const achievementFetchFailure = () => {
  return {
    type: 'ACHIEVEMENT_FETCH_FAILED',
  };
};

export const mutation = {
  achievementFetchRequest,
  achievementFetchSuccess,
  achievementFetchFailure,
};
