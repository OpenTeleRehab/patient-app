/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getTransfers = async (accessToken) => {
  return await callApi(
    '/transfer',
    accessToken,
  );
};

export const Transfer = {
  getTransfers,
};
