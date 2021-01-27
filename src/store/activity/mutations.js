/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const treatmentPlanFetchRequest = (data) => {
  return {
    type: 'TREATMENT_PLAN_FETCH_REQUESTED',
    data,
  };
};
const treatmentPlanFetchSuccess = (data) => {
  return {
    type: 'TREATMENT_PLAN_FETCH_SUCCEED',
    data,
  };
};

const treatmentPlanFetchFailure = () => {
  return {
    type: 'TREATMENT_PLAN_FETCH_FAILED',
  };
};

const todayActivitySummaryRequest = () => {
  return {
    type: 'TREATMENT_PLAN_FETCH_REQUESTED',
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

const completeActivityRequest = (data) => {
  return {
    type: 'COMPLETE_ACTIVITY_REQUEST',
    data,
  };
};

const completeActivitySuccess = () => {
  return {
    type: 'COMPLETE_ACTIVITY_SUCCEED',
  };
};

const completeActivityFailure = () => {
  return {
    type: 'COMPLETE_ACTIVITY_FAILED',
  };
};

export const mutation = {
  treatmentPlanFetchRequest,
  treatmentPlanFetchSuccess,
  treatmentPlanFetchFailure,
  todayActivitySummaryRequest,
  todayActivitySummarySuccess,
  todayActivitySummaryFailure,
  completeActivityRequest,
  completeActivitySuccess,
  completeActivityFailure,
};
