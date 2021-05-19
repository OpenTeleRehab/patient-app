/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getTreatmentPlan = async (today, accessToken, lang) => {
  const body = {today, lang};
  return await callApi('/treatment-plan/get-treatment-plan', accessToken, body);
};

const getTodayActivitySummary = async (today, accessToken) => {
  return await callApi('/treatment-plan/get-summary', accessToken, {today});
};

const completeActivity = async (payload, accessToken) => {
  return await callApi(
    '/treatment-plan/complete_activity',
    accessToken,
    JSON.stringify(Array.isArray(payload) ? payload : [payload]),
    'post',
  );
};

const completeQuestionnaire = async (payload, accessToken) => {
  return await callApi(
    '/treatment-plan/complete_questionnaire',
    accessToken,
    JSON.stringify(Array.isArray(payload) ? payload : [payload]),
    'post',
  );
};

const completeGoal = async (payload, accessToken) => {
  return await callApi(
    '/treatment-plan/complete_goal',
    accessToken,
    JSON.stringify(Array.isArray(payload) ? payload : [payload]),
    'post',
  );
};

export const Activity = {
  getTreatmentPlan,
  getTodayActivitySummary,
  completeActivity,
  completeQuestionnaire,
  completeGoal,
};
