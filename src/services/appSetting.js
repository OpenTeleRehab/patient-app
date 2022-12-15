import {callApi} from '../utils/request';

const getAppSettings = async (payload) => {
  return await callApi('/app/settings', '', payload);
};

export const AppSettings = {
  getAppSettings,
};
