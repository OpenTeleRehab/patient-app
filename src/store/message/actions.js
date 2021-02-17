/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Message} from '../../services/message';
import {mutation} from './mutations';

export const getMessageList = () => async (dispatch, getState) => {
  dispatch(mutation.messageFetchRequest());
  const {accessToken} = getState().user;
  const data = await Message.getMessage(accessToken);
  if (data.success) {
    dispatch(mutation.messageFetchSuccess(data.data));
  } else {
    dispatch(mutation.messageFetchFailure());
  }
};
