/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {PartnerLogo} from '../../services/partnerLogo';
import {mutation} from './mutations';

export const getPartnerLogoRequest = () => async (dispatch) => {
  dispatch(mutation.partnerLogoFetchRequest());
  const data = await PartnerLogo.getPartnerLogo();
  if (data && data.data) {
    dispatch(mutation.partnerLogoFetchSuccess(data.data));
  } else {
    dispatch(mutation.partnerLogoFetchFailure());
  }
};
