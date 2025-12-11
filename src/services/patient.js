/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callTherapistApi} from '../utils/request';

const getPatients = async (payload, accessToken) => {
  return await callTherapistApi(
    '/patient',
    accessToken,
    payload,
  );
};

const getPatient = async (id, accessToken) => {
  return await callTherapistApi(
    `/patient/id/${id}`,
    accessToken,
  );
};

export const Patient = {
  getPatients,
  getPatient,
};
