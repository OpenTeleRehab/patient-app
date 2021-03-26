/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callChatApi} from '../utils/request';

const getUserStatus = async (chatUserIds, userId, authToken) => {
  const fields = JSON.stringify({status: 1});
  const query = JSON.stringify({_id: {$in: chatUserIds}});
  const body = {fields, query, count: 999999};
  return await callChatApi('/users.list', userId, authToken, body);
};

const getLastMessages = async (chatRooms, userId, authToken) => {
  const fields = JSON.stringify({msgs: 1, lastMessage: 1});
  const query = JSON.stringify({_id: {$in: chatRooms}});
  const body = {fields, query, count: 999999};
  return await callChatApi('/im.list', userId, authToken, body);
};

export const Rocketchat = {
  getUserStatus,
  getLastMessages,
};
