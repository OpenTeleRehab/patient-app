/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const goalFetchSuccess = (data) => {
  return {
    type: 'GOAL_FETCH_SUCCEED',
    data,
  };
};

const goalFetchFailure = () => {
  return {
    type: 'GOAL_FETCH_FAILED',
  };
};

export const mutation = {
  goalFetchSuccess,
  goalFetchFailure,
};
