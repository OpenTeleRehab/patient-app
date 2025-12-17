/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getPhcServices = async (accessToken) => {
  return await callApi(
    '/phc-services',
    accessToken,
  );
};

const getPhcWorkers = async (payload, accessToken) => {
  return await callApi(
    '/phc-workers/list/by-phc-service',
    accessToken,
    payload,
  );
};

export const PhcService = {
  getPhcServices,
  getPhcWorkers,
};
