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

const acceptTransferPatient = async (transferInfo, accessToken) => {
  return await callApi(
    `/transfer/accept/${transferInfo.id}?transfer_id=${transferInfo.id}&patient_id=${transferInfo.patient_id}`,
    accessToken,
  );
};

const declineTransferPatient = async (transferInfo, accessToken) => {
  return await callApi(`/transfer/decline/${transferInfo.id}`, accessToken);
};

export const Transfer = {
  getTransfers,
  createTransferPatient,
  acceptTransferPatient,
  declineTransferPatient,
};
