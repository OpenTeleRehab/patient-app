import {Rocketchat} from '../../services/rocketchat';
import {Therapist} from '../../services/therapist';
import {mutation} from './mutations';
import {updateIndicatorList} from '../indicator/actions';
import {Chat} from '../../services/chat';
import {loadHistoryInRoom} from '../../utils/rocketchat';
import {Call} from '../../services/call';
import {isPhcWorker} from '../../utils/helper';

export const setChatSubscribeIds = (payload) => (dispatch) => {
  dispatch(mutation.setChatSubscribeIdsSuccess(payload));
};

export const authenticateChatUser = (payload) => (dispatch) => {
  dispatch(mutation.chatUserLoginSuccess(payload));
};

export const clearChatData = () => (dispatch) => {
  dispatch(mutation.clearChatDataSuccess());
};

export const updateVideoCallStatus = (payload) => (dispatch) => {
  dispatch(mutation.updateVideoCallStatusSuccess(payload));
};

export const clearVideoCallStatus = () => (dispatch) => {
  dispatch(mutation.updateVideoCallStatusSuccess({}));
};

export const clearSecondaryVideoCallStatus = () => (dispatch) => {
  dispatch(mutation.updateSecondaryVideoCallStatusSuccess({}));
};

export const clearCallAccessToken = () => (dispatch) => {
  dispatch(mutation.clearCallAccessTokenSuccess());
};

export const getChatRooms = (chatSocket) => async (dispatch, getState) => {
  const {accessToken, profile} = getState().user;
  const {chatAuth} = getState().rocketchat;

  const chatRooms = [];

  const subscriptions = await Rocketchat.getSubscriptions(
    chatAuth.userId,
    chatAuth.token,
  );

  const chatUserStatus = await Rocketchat.getUserStatus(
    profile.identity,
    chatAuth.userId,
    chatAuth.token,
  );

  if (subscriptions.length && chatUserStatus.success) {
    dispatch(mutation.getChatRoomsRequest());

    if (isPhcWorker(profile?.type)) {
      const patientChatRooms = await Chat.getPatientChatRooms(accessToken);
      const therapistChatRooms = await Chat.getTherapistChatRooms(accessToken);
      const phcWorkerChatRooms = await Chat.getPhcWorkerChatRooms(accessToken);

      if (patientChatRooms.success) {
        for (const chatRoom of patientChatRooms.data) {
          const subscription = subscriptions.find((room) =>
            room.rid.includes(chatRoom.chat_user_id),
          );

          if (subscription) {
            const chatUser = chatUserStatus.users.find(
              (user) => user.username === chatRoom.identity,
            );

            chatRooms.push({
              rid: subscription.rid,
              name: `${chatRoom.last_name} ${chatRoom.first_name}`,
              professionId: chatRoom.profession_id,
              enabled: true,
              unreads: subscription.unread,
              u: {
                _id: chatRoom.chat_user_id,
                username: chatRoom.identity,
                status: chatUser?.status ?? 'offline',
              },
              messages: [],
              lastMessage: {},
              totalMessages: 0,
            });

            loadHistoryInRoom(chatSocket, subscription.rid, profile.id);
          }
        }
      }

      if (therapistChatRooms.success) {
        for (const chatRoom of therapistChatRooms.data) {
          const subscription = subscriptions.find((room) =>
            room.rid.includes(chatRoom.chat_user_id),
          );

          if (subscription) {
            const chatUser = chatUserStatus.users.find(
              (user) => user.username === chatRoom.identity,
            );

            chatRooms.push({
              rid: subscription.rid,
              name: `${chatRoom.last_name} ${chatRoom.first_name}`,
              professionId: chatRoom.profession_id,
              enabled: true,
              unreads: subscription.unread,
              u: {
                _id: chatRoom.chat_user_id,
                username: chatRoom.identity,
                status: chatUser?.status ?? 'offline',
              },
              messages: [],
              lastMessage: {},
              totalMessages: 0,
            });

            loadHistoryInRoom(chatSocket, subscription.rid, profile.id);
          }
        }
      }

      if (phcWorkerChatRooms.success) {
        for (const chatRoom of phcWorkerChatRooms.data) {
          const subscription = subscriptions.find((room) =>
            room.rid.includes(chatRoom.chat_user_id),
          );

          if (subscription) {
            const chatUser = chatUserStatus.users.find(
              (user) => user.username === chatRoom.identity,
            );

            chatRooms.push({
              rid: subscription.rid,
              name: `${chatRoom.last_name} ${chatRoom.first_name}`,
              professionId: chatRoom.profession_id,
              enabled: true,
              unreads: subscription.unread,
              u: {
                _id: chatRoom.chat_user_id,
                username: chatRoom.identity,
                status: chatUser?.status ?? 'offline',
              },
              messages: [],
              lastMessage: {},
              totalMessages: 0,
            });

            loadHistoryInRoom(chatSocket, subscription.rid, profile.id);
          }
        }
      }
    } else {
      const primaryTherapistIds = [profile.therapist_id];
      const secondaryTherapistIds = profile.secondary_therapists ?? [];
      const secondaryPhcWorkerIds = profile.supplementary_phc_workers ?? [];
      const therapists = await Therapist.getTherapists({
        ids: JSON.stringify([
          ...primaryTherapistIds,
          ...secondaryTherapistIds,
          ...secondaryPhcWorkerIds,
        ]),
      });

      if (therapists.success) {
        for (const therapist of therapists.data) {
          const subscription = subscriptions.find((room) =>
            room.rid.includes(therapist.chat_user_id),
          );

          if (subscription) {
            const chatUser = chatUserStatus.users.find(
              (user) => user.username === therapist.identity,
            );

            chatRooms.push({
              rid: subscription.rid,
              name: `${therapist.last_name} ${therapist.first_name}`,
              professionId: therapist.profession_id,
              enabled: true,
              unreads: subscription.unread,
              u: {
                _id: therapist.chat_user_id,
                username: therapist.identity,
                status: chatUser?.status ?? 'offline',
              },
              messages: [],
              lastMessage: {},
              totalMessages: 0,
            });

            loadHistoryInRoom(chatSocket, subscription.rid, profile.id);
          }
        }
      }
    }

    if (chatRooms.length > 0) {
      dispatch(mutation.getChatRoomsSuccess(chatRooms));
      dispatch(mutation.selectRoomSuccess(chatRooms[0]));
      return true;
    }
  }

  dispatch(mutation.getChatRoomsFailure());
  return false;
};

export const getMessagesInRoom = (payload) => async (dispatch, getState) => {
  if (!payload.length) {
    return false;
  }
  const {chatAuth, chatRooms} = getState().rocketchat;
  const fIndex = chatRooms.findIndex((cr) => cr.rid === payload[0].rid);
  const counters = await Rocketchat.getMessageCounters(
    chatRooms[fIndex].rid,
    chatAuth.userId,
    chatAuth.token,
  );
  chatRooms[fIndex].lastMessage = payload[0];
  chatRooms[fIndex].messages = payload;

  if (counters.success) {
    chatRooms[fIndex].totalMessages = counters.msgs;
    chatRooms[fIndex].unreads = counters.unreads;
  }
  dispatch(mutation.getChatRoomsSuccess(chatRooms));
};

export const clearOfflineMessages = () => async (dispatch) => {
  dispatch(mutation.clearOfflineMessagesSuccess());
};

export const prependNewMessage = (payload) => async (dispatch, getState) => {
  const {isOnChatScreen} = getState().indicator;
  const {chatRooms, selectedRoom, messages} = getState().rocketchat;

  const fIndex = chatRooms.findIndex((room) => room.rid === payload.rid);

  if (fIndex > -1) {
    if (selectedRoom?.rid === payload.rid) {
      const msgIndex = messages.findIndex((msg) => msg._id === payload._id);

      if (msgIndex > -1) {
        messages[msgIndex] = payload;
      } else {
        messages.unshift(payload);
      }

      dispatch(mutation.prependNewMessageSuccess(messages));

      if (isOnChatScreen) {
        chatRooms[fIndex].unreads = 0;
      }
    } else {
      chatRooms[fIndex].unreads += 1;
      chatRooms[fIndex].lastMessage = payload;
    }

    // Update unread message indicator
    const hasUnreadMessage = chatRooms.some((room) => room.unreads);
    dispatch(updateIndicatorList({hasUnreadMessage}));

    // Update chatRooms with new prepend message
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

export const getCallAccessToken = (roomId) => async (dispatch) => {
  dispatch(mutation.getCallAccessTokenRequest());
  const data = await Call.getCallAccessToken(roomId);
  if (data.success) {
    dispatch(mutation.getCallAccessTokenSuccess(data.token));
    return true;
  } else {
    dispatch(mutation.getCallAccessTokenFailure());
    return false;
  }
};

export const sendPodcastNotification = (payload) => async () => {
  await Call.sendPodcastNotification(payload);
};
