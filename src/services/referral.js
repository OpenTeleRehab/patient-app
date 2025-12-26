import {callApi} from '../utils/request';

const createReferral = async (payload, accessToken) => {
  return await callApi('/patient-referrals', accessToken, payload, 'post');
};

export const Referral = {
  createReferral,
};
