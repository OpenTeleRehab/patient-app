/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';
import {getUserCountryIsoCode} from '../utils/country';

const getTherapists = async (payload) => {
  return await callApi('/therapist/by-ids', '', payload);
};

const getPhcWorkers = async (accessToken) => {
  return await callApi('/phc-workers', accessToken, '');
};

const getReferralTherapists = async (accessToken) => {
  return await callApi(
    '/phc-workers/get-referral-therapists',
    accessToken,
    '',
    'get',
    false,
    {country: getUserCountryIsoCode()}
  );
};

export const Therapist = {
  getTherapists,
  getPhcWorkers,
  getReferralTherapists,
};
