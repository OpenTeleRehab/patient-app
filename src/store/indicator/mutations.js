/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const indicatorLoadSuccess = () => {
  return {
    type: 'INDICATOR_LOAD_SUCCEED',
  };
};

const indicatorUpdateSuccess = (data) => {
  return {
    type: 'INDICATOR_UPDATE_SUCCEED',
    data,
  };
};

export const mutation = {
  indicatorLoadSuccess,
  indicatorUpdateSuccess,
};
