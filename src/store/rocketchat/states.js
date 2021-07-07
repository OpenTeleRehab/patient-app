/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
export const initialState = {
  chatRooms: [],
  messages: [],
  chatAuth: undefined,
  subscribeIds: undefined,
  selectedRoom: undefined,
  videoCall: {
    _id: '',
    rid: '',
    status: '',
    u: {},
  },
  secondaryVideoCall: {
    _id: '',
    rid: '',
    status: '',
    u: {},
  },
  offlineMessages: [],
};
