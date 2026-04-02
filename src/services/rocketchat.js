/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callChatApi} from '../utils/request';

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

const getUserStatus = async (usernames, userId, authToken) => {
  const fields = JSON.stringify({status: 1});
  const query = JSON.stringify({username: {$in: usernames}});
  const body = {fields, query, count: 999999};
  return await callChatApi('/users.list', userId, authToken, body);
};

const getLastMessages = async (roomIds, userId, authToken) => {
  const fields = JSON.stringify({msgs: 1, lastMessage: 1});
  const query = JSON.stringify({_id: {$in: roomIds}});
  const body = {fields, query, count: 999999};
  return await callChatApi('/im.list', userId, authToken, body);
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
  getUserStatus,
  getLastMessages,
  markMessagesAsRead,
  sendAttachmentMessage,
};
