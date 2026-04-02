/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';
import store from '../store';

const send = async (payload) => {
  const {accessToken} = store.getState().user;

  return await callApi('/push-notification', accessToken, payload);
};

export const Notification = {
  send,
};
