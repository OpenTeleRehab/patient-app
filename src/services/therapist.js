/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callTherapistApi} from '../utils/request';

const getTherapists = async (payload) => {
  return await callTherapistApi('/therapist/by-ids', payload);
};

export const Therapist = {
  getTherapists,
};
