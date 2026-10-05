import {Rocketchat} from '../../services/rocketchat';
import {Therapist} from '../../services/therapist';
import {mutation} from './mutations';
import {Chat} from '../../services/chat';
import {Call} from '../../services/call';
import {getMessageTime, isPhcWorker} from '../../utils/helper';
import {CALL_STATUS, CHAT_USER_STATUS, STORAGE_KEY} from '../../variables/constants';
import {Notification} from '../../services/notification';
import {sendNewMessage, updateMessage} from '../../utils/rocketchat';
import {getLocalData} from '../../utils/local_storage';
import RNCallKeep from 'react-native-callkeep';
import {acceptedRequest} from '../call/actions';
import {AppState} from 'react-native';

// isOnChatScreen comes from navigation focus, which stays true while the app is in the background with a chat
// open; messages arriving then were never seen, so they must stay unread (locally and on the server).
const isViewingChatRoom = (getState, rid) =>
  AppState.currentState === 'active' &&
  getState().indicator.isOnChatScreen &&
  getState().rocketchat.selectedRoom?.rid === rid;

export const setChatSubscribeIds = (payload) => (dispatch) => {
  dispatch(mutation.setChatSubscribeIdsSuccess(payload));
};

export const authenticateChatUser = (payload) => (dispatch) => {
  dispatch(mutation.chatUserLoginSuccess(payload));
};

export const updateVideoCallStatus = (payload) => (dispatch) => {
  dispatch(mutation.updateVideoCallStatusSuccess(payload));
};

// Presence + last message are 2 requests per room; a PHC worker can have many rooms, so cap how many run
// at once rather than firing them all (Rocket.Chat rate-limits its REST API).
const CHAT_ROOM_REQUEST_CONCURRENCY = 5;

// Like Promise.all(items.map(task)), keeping order, but with at most `limit` tasks in flight.
const mapWithConcurrency = async (items, limit, task) => {
  const results = new Array(items.length);
  let next = 0;

  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  };

  await Promise.all(Array.from({length: Math.min(limit, items.length)}, worker));
  return results;
};

// `contact` is a patient, therapist or PHC worker from our API; null when they have no Rocket.Chat room with us.
const buildChatRoom = async (contact, subscriptions) => {
  // Direct-message rids are the two user ids joined; only match those, never a channel/group rid.
  const subscription = subscriptions.find(
    (room) => room.t === 'd' && room.rid.includes(contact.chat_user_id),
  );

  if (!subscription) {
    return null;
  }

  const [status, lastMessage] = await Promise.all([
    Rocketchat.getUserPresence(contact.identity),
    Rocketchat.getLastMessage(subscription.rid),
  ]);

  return {
    rid: subscription.rid,
    name: `${contact.last_name} ${contact.first_name}`,
    professionId: contact.profession_id,
    enabled: true,
    unreads: subscription.unread,
    u: {
      _id: contact.chat_user_id,
      username: contact.identity,
      status: status?.presence ?? CHAT_USER_STATUS[0],
    },
    messages: [],
    // undefined = the request failed; getChatRooms then keeps the room's previous preview instead of blanking it.
    lastMessage: lastMessage?.success ? lastMessage.messages?.[0] ?? {} : undefined,
    totalMessages: 0,
  };
};

// Calls can overlap (e.g. a quick chat re-login); only the latest may write rooms or end the loading state.
let latestChatRoomsRequest = 0;

export const getChatRooms = () => async (dispatch, getState) => {
  const requestId = ++latestChatRoomsRequest;
  const isStale = () => requestId !== latestChatRoomsRequest;

  dispatch(mutation.getChatRoomsRequest());
  const {accessToken, profile} = getState().user;
  const {chatAuth} = getState().rocketchat;

  let chatRooms = [];

  // Contacts from our API, as a list of responses: for a PHC worker patients, therapists, PHC workers
  // (also the order the rooms are listed in); for a patient their therapists and PHC workers.
  const getContactResponses = async () => {
    if (isPhcWorker(profile?.type)) {
      return Promise.all([
        Chat.getPatientChatRooms(accessToken),
        Chat.getTherapistChatRooms(accessToken),
        Chat.getPhcWorkerChatRooms(accessToken),
      ]);
    }

    const primaryTherapistIds = [profile.therapist_id];
    const primaryPhcWorkerIds = [profile.phc_worker_id];
    const secondaryTherapistIds = profile.secondary_therapists ?? [];
    const secondaryPhcWorkerIds = profile.supplementary_phc_workers ?? [];

    return [
      await Therapist.getTherapists({
        ids: JSON.stringify([
          ...primaryTherapistIds,
          ...primaryPhcWorkerIds,
          ...secondaryTherapistIds,
          ...secondaryPhcWorkerIds,
        ]),
      }),
    ];
  };

  // Independent of each other, so fetched together.
  const [subscriptions, contactResponses] = await Promise.all([
    Rocketchat.getSubscriptions(chatAuth.userId, chatAuth.token),
    getContactResponses(),
  ]);

  // A failed request would silently drop rooms (all of them, or a whole group such as every therapist room)
  // from the new list, so treat it as a failed load and keep the current rooms instead.
  if (subscriptions === null || contactResponses.some((response) => !response.success)) {
    if (!isStale()) {
      dispatch(mutation.getChatRoomsFailure());
    }
    return false;
  }

  if (subscriptions.length) {
    const contacts = contactResponses.flatMap((response) => response.data ?? []);

    const rooms = await mapWithConcurrency(contacts, CHAT_ROOM_REQUEST_CONCURRENCY, (contact) =>
      buildChatRoom(contact, subscriptions),
    );
    chatRooms = rooms.filter(Boolean);

    if (isStale()) {
      return false;
    }

    if (chatRooms.length > 0) {
      // Keep already-loaded (persisted) history until loadHistory replaces it, so it stays visible offline.
      const {chatRooms: prevRooms = [], selectedRoom} = getState().rocketchat;

      chatRooms.forEach((room) => {
        const prevRoom = prevRooms.find((pr) => pr.rid === room.rid);
        room.messages = prevRoom?.messages || [];
        room.hasMoreHistory = prevRoom?.hasMoreHistory;

        // lastMessage/unreads are a snapshot from the start of this load; a message streamed in since
        // (or one still sending) is newer, so keep it rather than letting the preview go backwards.
        const prevLastMessage = prevRoom?.lastMessage;
        const isPrevNewer =
          !!prevLastMessage &&
          prevLastMessage._id !== room.lastMessage?._id &&
          (room.lastMessage === undefined || // request failed
            prevLastMessage.pending ||
            getMessageTime(prevLastMessage) > getMessageTime(room.lastMessage));

        if (isPrevNewer) {
          room.lastMessage = prevLastMessage;
          room.unreads = Math.max(room.unreads || 0, prevRoom.unreads || 0);
        } else if (room.lastMessage === undefined) {
          room.lastMessage = {};
        }

        // Same rule as prependNewMessage: the room being read has nothing unread.
        if (isViewingChatRoom(getState, room.rid)) {
          room.unreads = 0;
        }
      });
      dispatch(mutation.getChatRoomsSuccess(chatRooms));
      // Read after the awaits: the user may have opened a room while this was loading.
      if (selectedRoom === undefined) {
        dispatch(mutation.selectRoomSuccess(chatRooms[0]));
      }
      return true;
    }
  }

  if (isStale()) {
    return false;
  }

  // Loaded fine but no rooms (e.g. the last therapist was unassigned): show that rather than the old list.
  // selectedRoom is left alone: ChatPanel may be mounted and falls back to it; it isn't persisted anyway.
  dispatch(mutation.getChatRoomsSuccess([]));
  return true;
};

// A burst of incoming messages should mark the room read once, not once per message.
const MARK_READ_DEBOUNCE = 1000;
const markReadTimers = new Map();

// The server keeps its own unread count; clearing ours alone brings the badge back on the next room reload.
const markRoomAsReadSoon = (rid) => (dispatch, getState) => {
  clearTimeout(markReadTimers.get(rid));

  markReadTimers.set(
    rid,
    setTimeout(() => {
      markReadTimers.delete(rid);

      const {chatAuth} = getState().rocketchat;
      if (!chatAuth?.userId) {
        return;
      }

      // Offline this fails quietly; ChatPanel marks the room read again when it reconnects.
      Rocketchat.markMessagesAsRead(rid, chatAuth.userId, chatAuth.token);
    }, MARK_READ_DEBOUNCE),
  );
};

export const prependNewMessage = (payload) => (dispatch, getState) => {
  const {chatRooms, chatAuth} = getState().rocketchat;

  const chatRoom = chatRooms?.find((item) => item.rid === payload.rid);

  if (!chatRoom) {
    return;
  }

  const isNewMessage = !payload.isEdited && !chatRoom.messages?.some((item) => item._id === payload._id);
  const isOwnMessage = payload.user?._id === chatAuth?.userId;
  const isViewingRoom = isViewingChatRoom(getState, payload.rid);

  dispatch(mutation.prependNewMessageSuccess(payload));

  if (isViewingRoom) {
    dispatch(mutation.updateUnreadSuccess(payload.rid));

    // Our own messages never count as unread on the server.
    if (isNewMessage && !isOwnMessage) {
      dispatch(markRoomAsReadSoon(payload.rid));
    }
  } else if (isNewMessage && !isOwnMessage) {
    dispatch(mutation.incrementUnreadSuccess(payload.rid));
  }

  // An edit to an older message (e.g. a past call's status) must not replace the room preview.
  if (isNewMessage || chatRoom.lastMessage?._id === payload._id) {
    dispatch(mutation.updateLastMessageSuccess(payload));
  }
};

export const updateChatUserStatus = (payload) => (dispatch) => {
  dispatch(mutation.updateChatUserStatusSuccess(payload));
};

export const sendOfflineMessages = (chatSocket) => async (dispatch, getState) => {
  const {offlineMessages} = getState().rocketchat;

  if (offlineMessages.length) {
    const sentIds = [];

    for (const message of offlineMessages) {
      if (message.attachment) {
        if (await dispatch(postAttachmentMessage(message))) {
          // rooms.upload assigns its own _id, so the server copy arrives as a new message; drop the placeholder.
          dispatch(mutation.removeMessageSuccess(message));
          sentIds.push(message._id);
        }
      } else {
        dispatch(sendTextMessage(chatSocket, message));
        sentIds.push(message._id);
      }
    }

    // Keep failed uploads and anything queued while uploads were in flight for the next reconnect.
    const remaining = getState().rocketchat.offlineMessages.filter((item) => !sentIds.includes(item._id));
    dispatch(mutation.setOfflineMessagesSuccess(remaining));
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

export const acceptCallHandler = (chatSocket) => async (dispatch, getState) => {
  const {profile} = getState().user;
  const {chatRooms} = getState().rocketchat;

  const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);

  if (Object.keys(callInfo).length > 0 && getState().call?.accepted) {
    // Handled, don't send the accept again from another waiter
    dispatch(acceptedRequest(false));

    const chatRoom = chatRooms.find((item) => item.rid === callInfo.rid);

    const message = {
      _id: callInfo._id,
      rid: callInfo.rid,
      user: {
        _id: profile.chat_user_id,
        username: profile.identity,
      },
      text: CALL_STATUS.ACCEPTED,
    };

    dispatch(updateTextMessage(chatSocket, message));
    dispatch(getCallAccessToken(chatRoom.u._id));

    dispatch(mutation.hasAcceptedCall(true));
    dispatch(mutation.showAcceptedCall(true));

    if (callInfo.callUUID) {
      RNCallKeep.reportEndCallWithUUID(callInfo.callUUID, 2);
    }
  }
};

export const rejectCallHandler = (chatSocket) => async (dispatch, getState) => {
  const {profile} = getState().user;

  const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);
  const rejectedCall = await getLocalData(STORAGE_KEY.REJECTED_CALL);

  if (Object.keys(callInfo).length > 0 && rejectedCall === 'true') {
    const message = {
      _id: callInfo._id,
      rid: callInfo.rid,
      user: {
        _id: profile.chat_user_id,
        username: profile.identity,
      },
      text: callInfo.body.includes('audio')
        ? CALL_STATUS.AUDIO_MISSED
        : CALL_STATUS.VIDEO_MISSED,
    };

    dispatch(updateTextMessage(chatSocket, message));
  }
}

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
