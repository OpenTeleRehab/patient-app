/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const submitSurvey = async (payload, accessToken) => {
  return await callApi(
    '/survey/submit',
    accessToken,
    {...payload},
    'post',
  );
};

const skipSurvey = async (payload, accessToken) => {
  return await callApi(
    '/survey/skip',
    accessToken,
    {...payload},
    'post',
  );
};

const getPublishSurvey = async (payload, accessToken) => {
  return await callApi(
    '/survey/list/publish-survey',
    accessToken,
    payload,
  );
};

export const Survey = {
  getPublishSurvey,
  submitSurvey,
  skipSurvey,
};
