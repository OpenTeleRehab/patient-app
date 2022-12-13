/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Phone} from '../../services/phone';
import {mutation} from './mutations';

export const getPhoneRequest = (payload) => async (dispatch) => {
  dispatch(mutation.phoneFetchRequest);
  const data = await Phone.getPhone(payload);
  if (data.success) {
    dispatch(mutation.phoneFetchSuccess(data.data));
    return data.data;
  } else {
    dispatch(mutation.phoneFetchFailure());
    return false;
  }
};
