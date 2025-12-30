/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getTransfers = async (accessToken) => {
  return await callApi('/transfer', accessToken);
};

const createTransferPatient = async (transferData, accessToken) => {
  return await callApi('/transfer', accessToken, transferData, 'POST');
};

export const Transfer = {
  getTransfers,
  createTransferPatient,
};
