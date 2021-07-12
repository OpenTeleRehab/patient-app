import {Rocketchat} from '../../services/rocketchat';
import {Therapist} from '../../services/therapist';
import {mutation} from './mutations';
import {updateIndicatorList} from '../indicator/actions';
import {CALL_STATUS} from '../../variables/constants';

export const setChatSubscribeIds = (payload) => (dispatch) => {
  dispatch(mutation.setChatSubscribeIdsSuccess(payload));
};

export const authenticateChatUser = (payload) => (dispatch) => {
  dispatch(mutation.chatUserLoginSuccess(payload));
};

export const clearChatData = () => (dispatch) => {
  dispatch(mutation.clearChatDataSuccess());
};

export const updateVideoCallStatus = (payload) => (dispatch, getState) => {
  const {videoCall} = getState().rocketchat;
  if (
    Object.keys(videoCall).length === 0 ||
    payload.status === CALL_STATUS.ACCEPTED
  ) {
    dispatch(mutation.updateVideoCallStatusSuccess(payload));
  } else {
    dispatch(mutation.updateSecondaryVideoCallStatusSuccess(payload));
  }
};

export const clearVideoCallStatus = () => (dispatch) => {
  dispatch(mutation.updateVideoCallStatusSuccess({}));
};

export const clearSecondaryVideoCallStatus = () => (dispatch) => {
  dispatch(mutation.updateSecondaryVideoCallStatusSuccess({}));
};

export const getChatRooms = () => async (dispatch, getState) => {
  const {profile} = getState().user;
  const primaryTherapistIds = [profile.therapist_id];
  const secondaryTherapistIds = profile.secondary_therapists;
  const data = await Therapist.getTherapists({
    ids: JSON.stringify(primaryTherapistIds.concat(secondaryTherapistIds)),
  });
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
            professionId: therapist.profession_id,
            enabled: therapist.enabled,
            unreads: 0,
            u: {
              _id: userId,
              username: therapist.identity,
              status: 'offline',
            },
            messages: [],
            lastMessage: {},
            totalMessages: 0,
          });
        }
      }
    });
    dispatch(mutation.getChatRoomsSuccess(chatRooms));
    dispatch(mutation.selectRoomSuccess(chatRooms[0]));
    return true;
  } else {
    dispatch(mutation.getChatRoomsFailure());
    return false;
  }
};

export const getChatUsersStatus = () => async (dispatch, getState) => {
  const {chatAuth, chatRooms} = getState().rocketchat;
  const {userId, token} = chatAuth || {};
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
      dispatch(mutation.getChatUsersStatusFailure());
      return false;
    }
  }
};

export const getMessagesInRoom = (payload) => async (dispatch, getState) => {
  if (!payload.length) {
    return false;
  }
  const {chatAuth, chatRooms, selectedRoom} = getState().rocketchat;
  const {token, userId} = chatAuth || {};
  const fIndex = chatRooms.findIndex((cr) => cr.rid === payload[0].rid);
  const counters = await Rocketchat.getMessageCounters(
    chatRooms[fIndex].rid,
    userId,
    token,
  );
  const userStatus = await Rocketchat.getUserStatus(
    [chatRooms[fIndex].u._id],
    userId,
    token,
  );
  chatRooms[fIndex].lastMessage = payload[0];
  chatRooms[fIndex].messages = payload;
  chatRooms[fIndex].totalMessages = payload.length;
  chatRooms[fIndex].u.status = userStatus.success
    ? userStatus.users[0].status
    : 'offline';
  chatRooms[fIndex].unreads = counters.success
    ? counters.unreads
    : chatRooms[fIndex].unreads;

  if (chatRooms[fIndex].unreads > 0) {
    dispatch(updateIndicatorList({hasUnreadMessage: true}));
  }

  dispatch(mutation.getChatRoomsSuccess(chatRooms));

  if (payload[0].rid === selectedRoom.rid) {
    dispatch(mutation.getMessagesInRoomSuccess(payload));
  }
};

export const clearOfflineMessages = () => async (dispatch) => {
  dispatch(mutation.clearOfflineMessagesSuccess());
};

export const selectRoom = (payload) => async (dispatch, getState) => {
  const {chatAuth, chatRooms} = getState().rocketchat;
  const {token, userId} = chatAuth || {};
  const fIndex = chatRooms.findIndex((cr) => cr.rid === payload.rid);
  const markMessagesAsRead = await Rocketchat.markMessagesAsRead(
    payload.rid,
    userId,
    token,
  );
  if (markMessagesAsRead.success) {
    chatRooms[fIndex].unreads = 0;
    dispatch(mutation.selectRoomSuccess(payload));
    dispatch(mutation.getChatRoomsSuccess(chatRooms));
    dispatch(mutation.getMessagesInRoomSuccess(payload.messages));
  }
};

export const prependNewMessage = (payload) => async (dispatch, getState) => {
  const {isOnChatScreen} = getState().indicator;
  const {chatRooms, selectedRoom} = getState().rocketchat;
  let messages = getState().rocketchat.messages;
  if (selectedRoom !== undefined && selectedRoom.rid === payload.rid) {
    const fIndex = messages.findIndex((msg) => msg._id === payload._id);
    if (fIndex === -1) {
      messages = [payload].concat(messages);
    } else {
      messages[fIndex] = payload;
    }
    dispatch(mutation.prependNewMessageSuccess(messages));
  }
  const fIndex = chatRooms.findIndex((cr) => cr.rid === payload.rid);
  if (fIndex > -1) {
    if (isOnChatScreen) {
      chatRooms[fIndex].unreads = 0;
    } else {
      if (
        payload.text !== CALL_STATUS.VIDEO_ENDED &&
        payload.text !== CALL_STATUS.AUDIO_ENDED &&
        payload.text !== CALL_STATUS.VIDEO_MISSED &&
        payload.text !== CALL_STATUS.AUDIO_MISSED &&
        payload.text !== CALL_STATUS.ACCEPTED
      ) {
        chatRooms[fIndex].unreads += 1;
      }
    }
    if (payload !== CALL_STATUS.ACCEPTED) {
      chatRooms[fIndex].totalMessages += 1;
      chatRooms[fIndex].lastMessage = payload;
      chatRooms[fIndex].messages = [payload].concat(chatRooms[fIndex].messages);
    }
    dispatch(mutation.updateLastMessageSuccess(chatRooms));
  }
};

export const updateChatUserStatus = (payload) => (dispatch, getState) => {
  const {chatRooms} = getState().rocketchat;
  const fIndex = chatRooms.findIndex((cr) => cr.u._id === payload._id);
  if (fIndex > -1) {
    chatRooms[fIndex].u.status = payload.status;
    dispatch(mutation.getChatRoomsSuccess(chatRooms));
  }
};

export const postAttachmentMessage = (roomId, attachment) => async (
  dispatch,
  getState,
) => {
  const {chatAuth} = getState().rocketchat;
  const data = await Rocketchat.sendAttachmentMessage(
    roomId,
    chatAuth.userId,
    chatAuth.token,
    attachment,
  );
  if (data.success) {
    dispatch(mutation.sendAttachmentMessagesSuccess());
    return true;
  } else {
    dispatch(mutation.sendAttachmentMessagesFailure());
    return false;
  }
};
