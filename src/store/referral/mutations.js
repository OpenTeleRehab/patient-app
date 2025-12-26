const createReferralFetchRequest = () => {
  return {
    type: 'CREATE_REFERRAL_FETCH_REQUESTED',
  };
};

const createReferralFetchSucceed = () => {
  return {
    type: 'CREATE_REFERRAL_FETCH_SUCCEEDED',
  };
};

const createReferralFetchFailed = () => {
  return {
    type: 'CREATE_REFERRAL_FETCH_FAILED',
  };
};
export const mutation = {
  createReferralFetchRequest,
  createReferralFetchSucceed,
  createReferralFetchFailed,
};
