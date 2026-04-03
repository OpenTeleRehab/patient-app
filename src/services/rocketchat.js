/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callChatApi} from '../utils/request';
import store from '../store';

const login = async (user, password) => {
  const body = JSON.stringify({user, password});
  return await callChatApi('/login', '', '', body, 'post');
};

const getSubscriptions = async (userId, authToken) => {
  const response = await callChatApi('/subscriptions.get', userId, authToken);
  if (response.success) {
    return response.update;
  }
  return [];
};

const getUserPresence = async (username) => {
  const {chatAuth} = store.getState().rocketchat;

  return await callChatApi(
    `/users.getPresence?username=${username}`,
    chatAuth.userId,
    chatAuth.token,
  );
};

const getLastMessage = async (roomId) => {
  const {chatAuth} = store.getState().rocketchat;

  return await callChatApi(
    `/im.history?roomId=${roomId}&count=1`,
    chatAuth.userId,
    chatAuth.token,
  );
};

const markMessagesAsRead = async (roomId, userId, authToken) => {
  const method = 'post';
  const body = JSON.stringify({rid: roomId});
  return await callChatApi(
    '/subscriptions.read',
    userId,
    authToken,
    body,
    method,
  );
};

const sendAttachmentMessage = async (userId, authToken, roomId, attachment) => {
  const formData = new FormData();
  formData.append('description', attachment.caption);
  formData.append('file', attachment.file);
  return await callChatApi(
    `/rooms.upload/${roomId}`,
    userId,
    authToken,
    formData,
    'post',
    true,
  );
};

export const Rocketchat = {
  login,
  getSubscriptions,
  getUserPresence,
  getLastMessage,
  markMessagesAsRead,
  sendAttachmentMessage,
};
