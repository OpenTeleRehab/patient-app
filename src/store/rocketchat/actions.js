import {Rocketchat} from '../../services/rocketchat';
import {Therapist} from '../../services/therapist';
import {mutation} from './mutations';

export const setChatSubscribeIds = (payload) => (dispatch) => {
  dispatch(mutation.setChatSubscribeIdsSuccess(payload));
};

export const authenticateChatUser = (payload) => (dispatch) => {
  dispatch(mutation.chatUserLoginSuccess(payload));
};

export const getChatRooms = () => async (dispatch, getState) => {
  const {profile} = getState().user;
  const data = await Therapist.getTherapists(profile.therapist_id);
  if (data.success) {
    const roomIds = profile.chat_rooms;
    const chatRooms = [];
    data.data.forEach((therapist) => {
      const userId = therapist.chat_user_id;
      if (userId) {
        const fIndex = roomIds.findIndex((r) => r.includes(userId));
        if (fIndex > -1) {
          chatRooms.push({
            rid: roomIds[fIndex],
            name: `${therapist.last_name} ${therapist.first_name}`,
            enabled: therapist.enabled,
            unread: 0,
            u: {
              _id: userId,
              username: therapist.identity,
              status: 'offline',
            },
            lastMessage: {},
            totalMessages: 0,
          });
        }
      }
    });
    dispatch(mutation.getChatRoomsSuccess(chatRooms));
    if (chatRooms.length === 1) {
      dispatch(mutation.selectRoomSuccess(chatRooms[0]));
    }
    return true;
  } else {
    dispatch(mutation.getChatRoomsFail());
    return false;
  }
};

export const getChatUsersStatus = () => async (dispatch, getState) => {
  const {chatAuth, chatRooms} = getState().rocketchat;
  const {userId, token} = chatAuth;
  const userIds = [];
  const mapIndex = [];
  chatRooms.forEach((room, idx) => {
    if (room.enabled) {
      userIds.push(room.u._id);
      mapIndex[room.u._id] = idx;
    }
  });
  if (userIds.length) {
    const data = await Rocketchat.getUserStatus(userIds, userId, token);
    if (data.success) {
      data.users.forEach((user) => {
        chatRooms[mapIndex[user._id]].u.status = user.status;
      });
      dispatch(mutation.getChatUsersStatusSuccess(chatRooms));
      return true;
    } else {
      dispatch(mutation.getChatUsersStatusFail());
      return false;
    }
  }
};

export const getLastMessages = (roomIds) => async (dispatch, getState) => {
  const {chatAuth, chatRooms} = getState().rocketchat;
  const {token, userId} = chatAuth;
  const data = await Rocketchat.getLastMessages(roomIds, userId, token);
  if (data.success) {
    data.ims.forEach((message) => {
      if (message.lastMessage) {
        const {rid, msg, _id, ts, u} = message.lastMessage;
        const fIndex = chatRooms.findIndex((cr) => cr.rid === rid);
        if (fIndex > -1) {
          chatRooms[fIndex].lastMessage = {
            _id,
            text: msg,
            createdAt: ts,
            u: {_id: u._id},
          };
          chatRooms[fIndex].totalMessages = message.msgs;
        }
      }
    });
    dispatch(mutation.getLastMessagesSuccess(chatRooms));
    return true;
  } else {
    dispatch(mutation.getLastMessagesFailure());
    return false;
  }
};

export const getMessagesInRoom = (payload) => async (dispatch) => {
  dispatch(mutation.getMessagesInRoomSuccess(payload));
};

export const selectRoom = (payload) => (dispatch, getState) => {
  dispatch(mutation.selectRoomSuccess(payload));
  const {chatRooms} = getState().rocketchat;
  if (chatRooms.enabled) {
    const fIndex = chatRooms.findIndex((cr) => cr.rid === payload.rid);
    if (chatRooms[fIndex].unread > 0) {
      chatRooms[fIndex].unread = 0;
      dispatch(mutation.updateUnreadSuccess(chatRooms));
    }
  }
};

export const prependNewMessage = (payload) => (dispatch, getState) => {
  const {messages, chatRooms, selectedRoom} = getState().rocketchat;
  let currentRoom = false;
  if (selectedRoom !== undefined && selectedRoom.rid === payload.rid) {
    currentRoom = true;
    const fIndex = messages.findIndex((msg) => msg._id === payload._id);
    if (fIndex === -1) {
      dispatch(mutation.prependNewMessageSuccess(payload));
    }
  }
  const fIndex = chatRooms.findIndex((cr) => cr.rid === payload.rid);
  if (fIndex > -1) {
    if (!currentRoom) {
      chatRooms[fIndex].unread += 1;
    }
    chatRooms[fIndex].totalMessages += 1;
    chatRooms[fIndex].lastMessage = payload;
    dispatch(mutation.updateLastMessageSuccess(chatRooms));
  }
};

export const updateChatUserStatus = (payload) => (dispatch, getState) => {
  const {chatRooms} = getState().rocketchat;
  const fIndex = chatRooms.findIndex((cr) => cr.u._id === payload._id);
  if (fIndex > -1) {
    chatRooms[fIndex].u.status = payload.status;
    dispatch(mutation.updateChatUserStatusSuccess(chatRooms));
  }
};

export const clearChatData = () => (dispatch) => {
  dispatch(mutation.clearChatDataSuccess());
};
