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
