/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getTreatmentPlan = async (today, accessToken) => {
  const options = {
    uri: '/treatment-plan/get-treatment-plan',
    accessToken,
    body: {
      today,
    },
  };

  return await callApi(options);
};

const getTodayActivitySummary = async (today, accessToken) => {
  const options = {
    uri: '/treatment-plan/get-summary',
    accessToken,
    body: {
      today,
    },
  };

  return await callApi(options);
};

const completeActivity = async (id, payload, accessToken) => {
  const options = {
    uri: `/treatment-plan/complete_activity/${id}`,
    accessToken,
    body: {
      ...payload,
    },
  };

  return await callApi(options, 'post');
};

export const Activity = {
  getTreatmentPlan,
  getTodayActivitySummary,
  completeActivity,
};
