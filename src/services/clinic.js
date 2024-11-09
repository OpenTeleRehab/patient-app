/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getClinic = async (id) => {
  return await callApi(`/clinic/${id}`, '');
};

export const Clinic = {
  getClinic,
};
