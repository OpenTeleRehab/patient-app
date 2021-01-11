/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const activityFetchSuccess = (data) => {
  return {
    type: 'ACTIVITY_FETCH_SUCCEED',
    data,
  };
};

const activityFetchFailure = () => {
  return {
    type: 'ACTIVITY_FETCH_FAILED',
  };
};

export const mutation = {
  activityFetchSuccess,
  activityFetchFailure,
};
