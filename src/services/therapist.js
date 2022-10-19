/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getTherapists = async (payload, accessToken) => {
  return await callApi('/therapist/by-ids', accessToken, payload);
};

export const Therapist = {
  getTherapists,
};
