/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getActivities = () => {
  return {};
};

const getTodayActivitySummary = () => {
  return {
    success: true,
    data: {
      all: 6,
      completed: 4,
    },
  };
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
  getActivities,
  getTodayActivitySummary,
  completeActivity,
};
