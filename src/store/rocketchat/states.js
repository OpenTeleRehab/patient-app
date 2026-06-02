/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
export const initialState = {
  chatRooms: [],
  messages: [],
  callAccessToken: undefined,
  chatAuth: undefined,
  subscribeIds: undefined,
  selectedRoom: undefined,
  showIncomingCall: false,
  showAcceptedCall: false,
  hasStartedCall: false,
  hasAcceptedCall: false,
  videoCall: {
    _id: '',
    rid: '',
    status: '',
    u: {},
    startAt: 0,
  },
  offlineMessages: [],
};
