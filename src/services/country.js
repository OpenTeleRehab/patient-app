/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getCountries = async () => {
  return await callAdminApi('/country');
};

export const Country = {
  getCountries,
};
