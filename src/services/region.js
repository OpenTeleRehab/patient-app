/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getRegions = async (accessToken) => {
  return await callApi(
    '/regions',
    accessToken,
  );
};

export const Region = {
  getRegions,
};
