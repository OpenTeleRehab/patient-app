/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getProvinces = async (accessToken) => {
  return await callApi('/provinces', accessToken);
};

const getProvincesByUserCountry = async (accessToken) => {
  return await callApi('/provinces-by-user-country', accessToken);
};

export const Province = {
  getProvinces,
  getProvincesByUserCountry,
};
