/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import {callGlobalAdminApi} from '../utils/request';

const getClinic = async (id) => {
  return await callGlobalAdminApi(`/clinic/get-by-id/${id}`, '');
};

export const Clinic = {
  getClinic,
};
