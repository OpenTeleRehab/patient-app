/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {AppSettings} from '../../services/appSetting';
import {mutation} from './mutations';

export const getAppSettingsRequest = (payload) => async (dispatch) => {
  dispatch(mutation.appSettingsFetchRequest());
  const res = await AppSettings.getAppSettings(payload);
  if (res.success) {
    dispatch(mutation.appSettingsFetchSuccess(res.data));
  } else {
    dispatch(mutation.appSettingsFetchFailure());
  }
};
