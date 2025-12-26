/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getPatientChatRooms = async (accessToken) => {
 return await callApi('/patient/list-for-chatroom', accessToken);
};

const getPhcWorkerChatRooms = async (accessToken) => {
  return await callApi('/chat/phc-workers', accessToken);
};

const getTherapistChatRooms = async (accessToken) => {
  return await callApi('/chat/therapists', accessToken);
};

export const Chat = {
  getPatientChatRooms,
  getPhcWorkerChatRooms,
  getTherapistChatRooms,
};
