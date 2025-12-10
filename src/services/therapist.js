/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getTherapists = async (payload) => {
  return await callApi('/therapist/by-ids', '', payload);
};

const getPhcWorkers = async (accessToken) => {
  return await callApi('/phc-workers', accessToken, '');
};

export const Therapist = {
  getTherapists,
  getPhcWorkers,
};
