/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */

const partnerLogoFetchRequest = () => {
  return {
    type: 'PARTNER_LOGO_FETCH_REQUESTED',
  };
};
const partnerLogoFetchSuccess = (data) => {
  return {
    type: 'PARTNER_LOGO_FETCH_SUCCEED',
    data,
  };
};

const partnerLogoFetchFailure = () => {
  return {
    type: 'PARTNER_LOGO_FETCH_FAILED',
  };
};

export const mutation = {
  partnerLogoFetchRequest,
  partnerLogoFetchSuccess,
  partnerLogoFetchFailure,
};
