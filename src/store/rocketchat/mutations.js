/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const setChatSubscribeIdsSuccess = (data) => ({
  type: 'SET_CHAT_SUBSCRIBE_IDS_SUCCEED',
  data,
});

const chatUserLoginSuccess = (data) => ({
  type: 'CHAT_USER_LOGIN_SUCCEED',
  data,
});

const getChatRoomsSuccess = (data) => ({
  type: 'GET_CHAT_ROOMS_SUCCEED',
  data,
});

const getChatRoomsFailure = () => ({
  type: 'GET_CHAT_ROOMS_FAILED',
});

const getLastMessagesSuccess = (data) => ({
  type: 'GET_LAST_MESSAGES_SUCCEED',
  data,
});

const getLastMessagesFailure = () => ({
  type: 'GET_LAST_MESSAGES_FAILED',
});

const selectRoomSuccess = (data) => ({
  type: 'SELECT_ROOM_SUCCEED',
  data,
});

const updateUnreadSuccess = (data) => ({
  type: 'UPDATE_UNREAD_SUCCEED',
  data,
});

const getMessagesInRoomSuccess = (data) => ({
  type: 'GET_MESSAGES_IN_ROOM_SUCCEED',
  data,
});

const prependNewMessageSuccess = (data) => ({
  type: 'PREPEND_NEW_MESSAGE_SUCCEED',
  data,
});

const updateLastMessageSuccess = (data) => ({
  type: 'UPDATE_LAST_MESSAGE_SUCCESS',
  data,
});

const updateChatUserStatusSuccess = (data) => ({
  type: 'UPDATE_CHAT_USER_STATUS_SUCCEED',
  data,
});

const clearChatDataSuccess = () => ({
  type: 'CLEAR_CHAT_DATA_SUCCEED',
});

const sendAttachmentMessagesSuccess = () => ({
  type: 'SEND_ATTACHMENT_MESSAGES_SUCCEED',
});

const sendAttachmentMessagesFailure = () => ({
  type: 'SEND_ATTACHMENT_MESSAGES_FAILED',
});

const updateVideoCallStatusSuccess = (data) => ({
  type: 'UPDATE_VIDEO_CALL_STATUS_SUCCEED',
  data,
});

const updateSecondaryVideoCallStatusSuccess = (data) => ({
  type: 'UPDATE_SECONDARY_VIDEO_CALL_STATUS_SUCCEED',
  data,
});

const setOfflineMessagesSuccess = (data) => ({
  type: 'SET_OFFLINE_MESSAGES_SUCCEED',
  data,
});

const clearOfflineMessagesSuccess = () => ({
  type: 'CLEAR_OFFLINE_MESSAGES_SUCCEED',
});

export const mutation = {
  setChatSubscribeIdsSuccess,
  chatUserLoginSuccess,
  getChatRoomsSuccess,
  getChatRoomsFailure,
  getLastMessagesSuccess,
  getLastMessagesFailure,
  selectRoomSuccess,
  updateUnreadSuccess,
  getMessagesInRoomSuccess,
  prependNewMessageSuccess,
  updateLastMessageSuccess,
  updateChatUserStatusSuccess,
  clearChatDataSuccess,
  sendAttachmentMessagesSuccess,
  sendAttachmentMessagesFailure,
  updateVideoCallStatusSuccess,
  updateSecondaryVideoCallStatusSuccess,
  setOfflineMessagesSuccess,
  clearOfflineMessagesSuccess,
};
