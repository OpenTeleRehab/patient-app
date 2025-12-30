import {Referral} from '../../services/referral';
import {mutation} from './mutations';

export const createReferralRequest =
  (payload) => async (dispatch, getState) => {
    dispatch(mutation.createReferralFetchRequest());
    const {accessToken} = getState().user;
    const res = await Referral.createReferral(payload, accessToken);
    if (res) {
      dispatch(mutation.createReferralFetchSucceed());
      return res;
    } else {
      dispatch(mutation.createReferralFetchFailed());
    }
  };
