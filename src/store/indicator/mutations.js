/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const indicatorUpdateSuccess = (data) => {
  return {
    type: 'INDICATOR_UPDATE_SUCCEED',
    data,
  };
};

export const mutation = {
  indicatorUpdateSuccess,
};
