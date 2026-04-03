/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const showIncomingCall = (data) => ({
  type: 'SHOW_INCOME_CALL',
  data,
});

const showAcceptedCall = (data) => ({
  type: 'SHOW_ACCEPTED_CALL',
  data,
});

const hasStartedCall = (data) => ({
  type: 'HAS_STARTED_CALL',
  data,
});

const hasAcceptedCall = (data) => ({
  type: 'HAS_ACCEPTED_CALL',
  data,
});


const setChatSubscribeIdsSuccess = (data) => ({
  type: 'SET_CHAT_SUBSCRIBE_IDS_SUCCEED',
  data,
});

const setOfflineMessagesSuccess = (data) => ({
  type: 'SET_OFFLINE_MESSAGES_SUCCEED',
  data,
});

const chatUserLoginSuccess = (data) => ({
  type: 'CHAT_USER_LOGIN_SUCCEED',
  data,
});

const getChatRoomsRequest = () => ({
  type: 'GET_CHAT_ROOMS_REQUEST',
});

const getChatRoomsSuccess = (data) => ({
  type: 'GET_CHAT_ROOMS_SUCCEED',
  data,
});

const getChatRoomsFailure = () => ({
  type: 'GET_CHAT_ROOMS_FAILED',
});

const getCallAccessTokenRequest = () => ({
  type: 'GET_CALL_ACCESS_TOKEN_REQUEST',
});

const getCallAccessTokenSuccess = (token) => ({
  type: 'GET_CALL_ACCESS_TOKEN_SUCCEED',
  token,
});

const getCallAccessTokenFailure = () => ({
  type: 'GET_CALL_ACCESS_TOKEN_FAILED',
});

const selectRoomSuccess = (data) => ({
  type: 'SELECT_ROOM_SUCCEED',
  data,
});

const updateUnreadSuccess = (rid) => ({
  type: 'UPDATE_UNREAD_SUCCEED',
  rid,
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

const clearCallAccessTokenSuccess = () => ({
  type: 'CLEAR_CALL_ACCESS_TOKEN_SUCCESS',
});

const clearOfflineMessagesSuccess = () => ({
  type: 'CLEAR_OFFLINE_MESSAGES_SUCCEED',
});

export const mutation = {
  showIncomingCall,
  showAcceptedCall,
  hasStartedCall,
  hasAcceptedCall,
  setChatSubscribeIdsSuccess,
  setOfflineMessagesSuccess,
  chatUserLoginSuccess,
  getChatRoomsRequest,
  getChatRoomsSuccess,
  getChatRoomsFailure,
  getCallAccessTokenRequest,
  getCallAccessTokenSuccess,
  getCallAccessTokenFailure,
  selectRoomSuccess,
  updateUnreadSuccess,
  getMessagesInRoomSuccess,
  prependNewMessageSuccess,
  updateLastMessageSuccess,
  updateChatUserStatusSuccess,
  sendAttachmentMessagesSuccess,
  sendAttachmentMessagesFailure,
  updateVideoCallStatusSuccess,
  clearCallAccessTokenSuccess,
  clearOfflineMessagesSuccess,
};
