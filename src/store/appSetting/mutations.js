/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const appSettingsFetchRequest = () => {
  return {
    type: 'APP_SETTINGS_FETCH_REQUESTED',
  };
};
const appSettingsFetchSuccess = (data) => {
  return {
    type: 'APP_SETTINGS_FETCH_SUCCEED',
    data,
  };
};

const appSettingsFetchFailure = () => {
  return {
    type: 'APP_SETTINGS_FETCH_FAILED',
  };
};

const appSettingsUpdateSkipVersion = (data) => {
  return {
    type: 'APP_SETTINGS_UPDATE_SKIP_VERSION',
    data,
  };
};

export const mutation = {
  appSettingsFetchRequest,
  appSettingsFetchSuccess,
  appSettingsFetchFailure,
  appSettingsUpdateSkipVersion,
};
