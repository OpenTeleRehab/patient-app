/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Transfer} from '../../services/transfer';
import {mutation} from './mutations';

export const getTransfersRequest = () => async (dispatch, getState) => {
  dispatch(mutation.transfersFetchRequest());
  const {accessToken} = getState().user;
  const res = await Transfer.getTransfers(accessToken);
  if (res.success) {
    dispatch(mutation.transfersFetchSuccess(res.data));
  } else {
    dispatch(mutation.transfersFetchFailure());
  }
};

export const createTransferPatientRequest =
  (transferData) => async (dispatch, getState) => {
    dispatch(mutation.createTransferPatientRequest());
    const {accessToken} = getState().user;
    const res = await Transfer.createTransferPatient(transferData, accessToken);
    if (res.success) {
      dispatch(mutation.createTransferPatientSuccess());
      return res;
    } else {
      dispatch(mutation.createTransferPatientFailure());
    }
  };

export const acceptTransferPatientRequest =
  (transferInfo) => async (dispatch, getState) => {
    dispatch(mutation.acceptTransferPatientRequest());
    const {accessToken} = getState().user;
    const res = await Transfer.acceptTransferPatient(transferInfo, accessToken);
    if (res.success) {
      dispatch(mutation.acceptTransferPatientSuccess());
      return res;
    } else {
      dispatch(mutation.acceptTransferPatientFailure());
    }
  };

export const declineTransferPatientRequest =
  (transferInfo) => async (dispatch, getState) => {
    dispatch(mutation.declineTransferPatientRequest());
    const {accessToken} = getState().user;
    const res = await Transfer.declineTransferPatient(
      transferInfo,
      accessToken,
    );
    if (res.success) {
      dispatch(mutation.declineTransferPatientSuccess());
      return res;
    } else {
      dispatch(mutation.declineTransferPatientFailure());
    }
  };
