/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getTherapists = async (payload) => {
  return await callApi('/therapist/by-ids', payload);
};

export const Therapist = {
  getTherapists,
};
