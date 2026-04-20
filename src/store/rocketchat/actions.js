import {Rocketchat} from '../../services/rocketchat';
import {Therapist} from '../../services/therapist';
import {mutation} from './mutations';
import {updateIndicatorList} from '../indicator/actions';
import {Chat} from '../../services/chat';
import {Call} from '../../services/call';
import {isPhcWorker} from '../../utils/helper';
import {CHAT_USER_STATUS} from '../../variables/constants';
import {Notification} from '../../services/notification';
import {sendNewMessage, updateMessage} from '../../utils/rocketchat';

export const setChatSubscribeIds = (payload) => (dispatch) => {
  dispatch(mutation.setChatSubscribeIdsSuccess(payload));
};

export const authenticateChatUser = (payload) => (dispatch) => {
  dispatch(mutation.chatUserLoginSuccess(payload));
};

export const updateVideoCallStatus = (payload) => (dispatch) => {
  dispatch(mutation.updateVideoCallStatusSuccess(payload));
};

export const getChatRooms = () => async (dispatch, getState) => {
  const {accessToken, profile} = getState().user;
  const {chatAuth, selectedRoom} = getState().rocketchat;

  const chatRooms = [];

  const subscriptions = await Rocketchat.getSubscriptions(
    chatAuth.userId,
    chatAuth.token,
  );

  if (subscriptions.length) {
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
            const username = chatRoom.identity;
            const rid = subscription.rid;

            const status = await Rocketchat.getUserPresence(username);
            const lastMessage = await Rocketchat.getLastMessage(rid);

            chatRooms.push({
              rid: rid,
              name: `${chatRoom.last_name} ${chatRoom.first_name}`,
              professionId: chatRoom.profession_id,
              enabled: true,
              unreads: subscription.unread,
              u: {
                _id: chatRoom.chat_user_id,
                username: username,
                status: status?.presence ?? CHAT_USER_STATUS[0],
              },
              messages: [],
              lastMessage: lastMessage?.success
                ? lastMessage.messages?.[0] ?? {}
                : {},
              totalMessages: 0,
            });
          }
        }
      }

      if (therapistChatRooms.success) {
        for (const chatRoom of therapistChatRooms.data) {
          const subscription = subscriptions.find((room) =>
            room.rid.includes(chatRoom.chat_user_id),
          );

          if (subscription) {
            const username = chatRoom.identity;
            const rid = subscription.rid;

            const status = await Rocketchat.getUserPresence(username);
            const lastMessage = await Rocketchat.getLastMessage(rid);

            chatRooms.push({
              rid: rid,
              name: `${chatRoom.last_name} ${chatRoom.first_name}`,
              professionId: chatRoom.profession_id,
              enabled: true,
              unreads: subscription.unread,
              u: {
                _id: chatRoom.chat_user_id,
                username: username,
                status: status?.presence ?? CHAT_USER_STATUS[0],
              },
              messages: [],
              lastMessage: lastMessage?.success
                ? lastMessage.messages?.[0] ?? {}
                : {},
              totalMessages: 0,
            });
          }
        }
      }

      if (phcWorkerChatRooms.success) {
        for (const chatRoom of phcWorkerChatRooms.data) {
          const subscription = subscriptions.find((room) =>
            room.rid.includes(chatRoom.chat_user_id),
          );

          if (subscription) {
            const username = chatRoom.identity;
            const rid = subscription.rid;

            const status = await Rocketchat.getUserPresence(username);
            const lastMessage = await Rocketchat.getLastMessage(rid);

            chatRooms.push({
              rid: rid,
              name: `${chatRoom.last_name} ${chatRoom.first_name}`,
              professionId: chatRoom.profession_id,
              enabled: true,
              unreads: subscription.unread,
              u: {
                _id: chatRoom.chat_user_id,
                username: username,
                status: status?.presence ?? CHAT_USER_STATUS[0],
              },
              messages: [],
              lastMessage: lastMessage?.success
                ? lastMessage.messages?.[0] ?? {}
                : {},
              totalMessages: 0,
            });
          }
        }
      }
    } else {
      const primaryTherapistIds = [profile.therapist_id];
      const primaryPhcWorkerIds = [profile.phc_worker_id];
      const secondaryTherapistIds = profile.secondary_therapists ?? [];
      const secondaryPhcWorkerIds = profile.supplementary_phc_workers ?? [];
      const therapists = await Therapist.getTherapists({
        ids: JSON.stringify([
          ...primaryTherapistIds,
          ...primaryPhcWorkerIds,
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
            const username = therapist.identity;
            const rid = subscription.rid;

            const status = await Rocketchat.getUserPresence(username);
            const lastMessage = await Rocketchat.getLastMessage(rid);

            chatRooms.push({
              rid: rid,
              name: `${therapist.last_name} ${therapist.first_name}`,
              professionId: therapist.profession_id,
              enabled: true,
              unreads: subscription.unread,
              u: {
                _id: therapist.chat_user_id,
                username: username,
                status: status?.presence ?? CHAT_USER_STATUS[0],
              },
              messages: [],
              lastMessage: lastMessage?.success
                ? lastMessage.messages?.[0] ?? {}
                : {},
              totalMessages: 0,
            });
          }
        }
      }
    }

    if (chatRooms.length > 0) {
      dispatch(mutation.getChatRoomsSuccess(chatRooms));
      if (selectedRoom === undefined) {
        dispatch(mutation.selectRoomSuccess(chatRooms[0]));
      }
      return true;
    }
  }
  dispatch(mutation.getChatRoomsFailure());
  return false;
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

export const sendOfflineMessages = (chatSocket) => async (dispatch, getState) => {
  const {offlineMessages} = getState().rocketchat;

  if (offlineMessages.length) {
    for (const message of offlineMessages) {
      if (message.attachment) {
        await dispatch(postAttachmentMessage(message));
      } else {
        await dispatch(sendTextMessage(chatSocket, message));
      }
    }

    dispatch(clearOfflineMessages());
  }
};

export const sendTextMessage = (chatSocket, message, notifiable = true) => (dispatch, getState) => {
  const {profile} = getState().user;

  sendNewMessage(chatSocket, message, profile.id);

  if (notifiable && message?.user?.username?.startsWith('P')) {
    const notification = {
      _id: message._id,
      rid: message.rid,
      identity: message.user.username,
      title: profile.last_name + ' ' + profile.first_name,
      body: message.text,
    };

    dispatch(sendPodcastNotification(notification));
  }
};

export const updateTextMessage = (chatSocket, message, notifiable = true) => (dispatch, getState) => {
  const {profile} = getState().user;

  updateMessage(chatSocket, {_id: message._id, rid: message.rid, msg: message.text}, profile.id);

  if (notifiable && message?.user?.username?.startsWith('P')) {
    const notification = {
      _id: message._id,
      rid: message.rid,
      identity: message.user.username,
      title: profile.last_name + ' ' + profile.first_name,
      body: message.text,
    };

    dispatch(sendPodcastNotification(notification));
  }
};

export const postAttachmentMessage = (message) => async (dispatch, getState) => {
  const {chatAuth} = getState().rocketchat;
  const {profile} = getState().user;

  const notification = {
    _id: message._id,
    rid: message.rid,
    identity: message.user.username,
    title: profile.last_name + ' ' + profile.first_name,
    body: 'chat_attachment.title',
    translatable: true,
  };

  const data = await Rocketchat.sendAttachmentMessage(
    chatAuth.userId,
    chatAuth.token,
    message.rid,
    message.attachment,
  );
  if (data.success) {
    dispatch(mutation.sendAttachmentMessagesSuccess());
    dispatch(sendPodcastNotification(notification));
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
  if (payload.identity.startsWith('P')) {
    await Notification.send(payload);
    return true;
  }
  return false;
};

export const clearVideoCallStatus = () => (dispatch) => {
  dispatch(mutation.updateVideoCallStatusSuccess({}));
};

export const clearCallAccessToken = () => (dispatch) => {
  dispatch(mutation.clearCallAccessTokenSuccess());
};

export const clearOfflineMessages = () => async (dispatch) => {
  dispatch(mutation.clearOfflineMessagesSuccess());
};
