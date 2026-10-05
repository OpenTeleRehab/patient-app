/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
export const initialState = {
  chatRooms: [],
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
  },
  offlineMessages: [],
  // Chat user the persisted chat data (rooms, queued messages) belongs to; a different user signing in clears it.
  chatOwnerId: undefined,
  isLoading: false,
  // Room whose "load earlier" page is in flight; not persisted, so it can't stay stuck across a restart.
  loadingEarlierRoomId: undefined,
};
