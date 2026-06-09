/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {PhcService} from '../../services/phcService';
import {mutation} from './mutations';

export const getPhcServicesRequest = () => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.phcServicesFetchRequest());
  const {accessToken} = getState().user;
  const res = await PhcService.getPhcServices(accessToken);
  if (res.data) {
    dispatch(mutation.phcServicesFetchSuccess(res.data));
  } else {
    dispatch(mutation.phcServicesFetchFailure());
  }
};

export const getPhcServiceRequest = (id) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.phcServiceFetchRequest());
  const res = await PhcService.getPhcService(id);
  if (res.data) {
    dispatch(mutation.phcServiceFetchSuccess(res.data));
  } else {
    dispatch(mutation.phcServiceFetchFailure());
  }
};

export const getPhcWorkersRequest = (payload) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.phcWorkersFetchRequest());
  const {accessToken} = getState().user;
  const res = await PhcService.getPhcWorkers(payload, accessToken);
  if (res.success) {
    dispatch(mutation.phcWorkersFetchSuccess(res.data));
  } else {
    dispatch(mutation.phcWorkersFetchFailure());
  }
};
