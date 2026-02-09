/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';
import {isPhcWorker} from '../utils/helper';
import store from '../store';

const getCallAccessToken = async (roomId) => {
  const {accessToken, profile} = store.getState().user;

  if (isPhcWorker(profile.type)) {
    return await callApi('/therapist/get-call-access-token', accessToken, {
      room_id: roomId,
    });
  } else {
    return await callApi('/patient/get-call-access-token', accessToken, {
      room_id: roomId,
    });
  }
};

const sendPodcastNotification = async (payload) => {
  const {accessToken} = store.getState().user;

  return await callApi('/push-notification', accessToken, payload);
};

export const Call = {
  getCallAccessToken,
  sendPodcastNotification,
};
