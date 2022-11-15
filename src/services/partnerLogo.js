/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getPartnerLogo = async () => {
  return await callAdminApi('/partner-logo');
};

export const PartnerLogo = {
  getPartnerLogo,
};
