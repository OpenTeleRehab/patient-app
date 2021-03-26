/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callTherapistApi} from '../utils/request';

const getTherapists = async (id) => {
  return await callTherapistApi('/therapist', {id, patientApp: true});
};

export const Therapist = {
  getTherapists,
};
