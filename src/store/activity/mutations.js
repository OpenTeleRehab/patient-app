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

const todayActivitySummarySuccess = (data) => {
  return {
    type: 'TODAY_ACTIVITY_SUMMARY_REQUEST_SUCCEED',
    data,
  };
};

const todayActivitySummaryFailure = () => {
  return {
    type: 'TODAY_ACTIVITY_SUMMARY_REQUEST_FAILED',
  };
};

export const mutation = {
  activityFetchSuccess,
  activityFetchFailure,
  todayActivitySummarySuccess,
  todayActivitySummaryFailure,
};
