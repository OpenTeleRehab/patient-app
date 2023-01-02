/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callChatApi} from '../utils/request';

const login = async (user, password) => {
  const body = JSON.stringify({user, password});
  return await callChatApi('/login', '', '', body, 'post');
};

const getUserStatus = async (chatUsernames, userId, authToken) => {
  const fields = JSON.stringify({status: 1});
  const query = JSON.stringify({username: {$in: chatUsernames}});
  const body = {fields, query, count: 999999};
  return await callChatApi('/users.list', userId, authToken, body);
};

const getLastMessages = async (chatRooms, userId, authToken) => {
  const fields = JSON.stringify({msgs: 1, lastMessage: 1});
  const query = JSON.stringify({_id: {$in: chatRooms}});
  const body = {fields, query, count: 999999};
  return await callChatApi('/im.list', userId, authToken, body);
};

const getMessageCounters = async (roomId, userId, authToken) => {
  return await callChatApi(`/im.counters?roomId=${roomId}`, userId, authToken);
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

const sendAttachmentMessage = async (roomId, userId, authToken, attachment) => {
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
  getUserStatus,
  getLastMessages,
  getMessageCounters,
  markMessagesAsRead,
  sendAttachmentMessage,
};
