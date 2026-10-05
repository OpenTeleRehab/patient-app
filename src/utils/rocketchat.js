import {
  authenticateChatUser,
  prependNewMessage,
  rejectCallHandler,
  sendOfflineMessages,
  updateChatUserStatus,
  updateVideoCallStatus,
} from '../store/rocketchat/actions';
import {updateIndicatorList} from '../store/indicator/actions';
import {mutation} from '../store/rocketchat/mutations';
import {CALL_STATUS, CHAT_USER_STATUS} from '../variables/constants';
import {getUniqueId, getChatMessage} from './helper';
import {Rocketchat} from '../services/rocketchat';
import {checkCallBusy} from './chat';
import store from '../store';

// Set by the latest initialChatSocket(); lets AppProvider skip the reconnect backoff when the network returns.
let reconnectNow = () => {};

export const reconnectChatSocket = (options) => reconnectNow(options);

// loadHistory request id -> {roomId, liveIds}. The reply has no room of its own (and an empty room has no message
// to read one from), and a reply for a room the user already left must not replace the open room's messages.
// liveIds: messages streamed into that room while the request was in flight. The reply is a snapshot that may
// predate them, so they are kept rather than wiped by it (ids, not timestamps: server and device clocks differ).
// isOlderPage: a "load earlier" page, appended below what's loaded instead of replacing the newest messages.
const pendingHistoryRooms = new Map();

// Messages per loadHistory request; the first page on open, then this many more per "load earlier".
export const HISTORY_PAGE_SIZE = 50;

// Set by the latest initialChatSocket(); lets the auth flow drop the current user's connection while logging in as
// another account, and AppProvider shut it down on an account switch. The closed socket is ignored from then on,
// so it can't log back in as the previous user and replace chatAuth.
let disconnectNow = () => {};
let resumeNow = () => {};

// resumable: false for an account switch, so resumeChatSocket() can't bring the previous user's socket back.
export const disconnectChatSocket = (options) => disconnectNow(options);
export const resumeChatSocket = () => resumeNow();

let latestSession = 0;
let authenticatedSocket = null;
let loginWaiters = [];

// Resolves with the socket once the chat login is done, methods sent before it fail with "Invalid user"
export const waitForChatLogin = () => {
  if (authenticatedSocket?.readyState === WebSocket.OPEN) {
    return Promise.resolve(authenticatedSocket);
  }

  return new Promise((resolve) => loginWaiters.push(resolve));
};

export const initialChatSocket = (
  dispatch,
  subscribeIds,
  username,
  password,
  updateSocketRef, // New callback to update the socket reference
) => {
  let userId = '';
  let authToken = '';
  const {loginId, roomMessageId, notifyLoggedId} = subscribeIds;

  let reconnectAttempts = 0;
  let reconnectTimeout;
  let allowDisconnect = false;
  let isPaused = false;
  let currentSocket;
  const session = ++latestSession;
  // Waiters from the previous user must not resolve with this user's socket
  loginWaiters = [];

  const connectSocket = () => {
    const socket = new WebSocket(store.getState().phone.chatWebsocketURL);
    currentSocket = socket;

    // A new socket is logged out until its login reply below. Keeping the previous connection's chatAuth made
    // "open + chatAuth" look ready right after a reconnect, so history loads and sends went out before the
    // login and the server rejected them ("invalid user"); a message sent then was lost.
    dispatch(authenticateChatUser(undefined));
    let hasConnected = false;

    updateSocketRef(socket);

    socket.addEventListener('open', (e) => {
      reconnectAttempts = 0; // Reset retry attempts on successful connection
      const options = {
        msg: 'connect',
        version: '1',
        support: ['1'],
      };
      socket.send(JSON.stringify(options));
    });

    socket.addEventListener('message', (e) => {
      // A socket replaced by a forced reconnect, or shut down by disconnectNow, may still deliver messages until
      // its close completes (e.g. a login reply that would set the previous user's chatAuth).
      if (socket !== currentSocket || allowDisconnect) {
        return;
      }

      const response = JSON.parse(e.data);
      const {id, result, error, collection, fields} = response;
      const resMessage = response.msg;

      if (resMessage === 'ping') {
        // Keep connection alive
        socket.send(JSON.stringify({msg: 'pong'}));
      } else if (resMessage === 'connected') {
        // Connection success => login
        hasConnected = true;
        dispatch(updateIndicatorList({isChatConnected: true}));

        Rocketchat.login(username, {
          digest: password,
          algorithm: 'sha-256',
        }).then((res) => {
          if (!res.data) {
            dispatch(updateIndicatorList({isChatServerDown: true}));
          } else if (socket.readyState === WebSocket.OPEN) {
            // Socket may have been closed by disconnectChatSocket() while logging in
            const options = {
              msg: 'method',
              method: 'login',
              id: loginId,
              params: [
                {
                  resume: res.data.authToken,
                },
              ],
            };
            socket.send(JSON.stringify(options));
          }
        });
      } else if (resMessage === 'result') {
        if (error !== undefined) {
          console.error(`WebSocket: ${error.reason}`);

          if (id === loginId) {
            dispatch(updateIndicatorList({isChatServerDown: true}));
          }

          if (pendingHistoryRooms.get(id)?.isOlderPage) {
            dispatch(mutation.setLoadingEarlierRoomSuccess(undefined));
          }
          pendingHistoryRooms.delete(id);
        } else if (id === loginId && result) {
          // Login success, and set auth token
          const {token, tokenExpires} = result;
          const expiredAt = new Date(tokenExpires.$date);
          userId = result.id;
          authToken = token;
          dispatch(updateIndicatorList({isChatServerDown: false}));
          dispatch(authenticateChatUser({userId, token, expiredAt}));

          if (session === latestSession) {
            authenticatedSocket = socket;
            loginWaiters.forEach((resolve) => resolve(socket));
            loginWaiters = [];
          }

          // Subscribe chat room message
          subscribeChatRoomMessage(socket, roomMessageId);

          // Subscribe to user logged status (patient)
          setTimeout(() => {
            subscribeUserLoggedStatus(socket, notifyLoggedId);
          }, 1000);

          // Reject call handler
          dispatch(rejectCallHandler(socket));

          // Send offline messages
          dispatch(sendOfflineMessages(socket));

          // Chat rooms are fetched by useGetChatRooms once chatAuth changes; fetching here as well loaded them twice.
        } else if (pendingHistoryRooms.has(id)) {
          // Load messages in a room
          const {roomId, liveIds, isOlderPage} = pendingHistoryRooms.get(id);
          pendingHistoryRooms.delete(id);

          const allMessages = (result?.messages || []).map((message) =>
            getChatMessage(message, userId, authToken),
          );
          // A short page means the server has nothing older.
          const hasMore = allMessages.length >= HISTORY_PAGE_SIZE;

          // ChatPanel reads the open room's messages from chatRooms, so this also updates the open chat.
          if (isOlderPage) {
            dispatch(mutation.appendOlderRoomMessagesSuccess(roomId, allMessages, hasMore));
          } else {
            dispatch(mutation.setRoomMessagesSuccess(roomId, allMessages, [...liveIds], hasMore));
          }
        }
      } else if (resMessage === 'changed') {
        if (collection === 'stream-room-messages') {
          // Trigger change in chat room
          const {profile} = store.getState().user;

          const {_id, msg, rid, u} = fields.args[0];

          if (msg?.startsWith('jitsi_call')) {
            if (checkCallBusy(u._id, msg)) {
              updateMessage(socket, {_id, rid, msg: CALL_STATUS.BUSY}, profile.id);
            } else {
              dispatch(
                updateVideoCallStatus({
                  _id,
                  rid,
                  status: msg,
                  u,
                }),
              );
            }
          }

          const newMessage = getChatMessage(fields.args[0], userId, authToken);

          pendingHistoryRooms.forEach((request) => {
            if (request.roomId === rid) {
              request.liveIds.add(_id);
            }
          });

          dispatch(prependNewMessage(newMessage));
        } else if (collection === 'stream-notify-logged') {
          // Trigger therapist logged status
          const res = fields.args[0];
          const data = {
            _id: res[0],
            username: res[1],
            status: CHAT_USER_STATUS[res[2]],
          };
          dispatch(updateChatUserStatus(data));
        }
      } else if (resMessage === 'removed' && collection === 'users') {
        // Close connection on logout
        socket.close();

        // Disconnect from old user
        allowDisconnect = true;

        dispatch(updateIndicatorList({isChatConnected: false}));
      }
    });

    socket.addEventListener('close', () => {
      if (authenticatedSocket === socket) {
        authenticatedSocket = null;
      }

      // Closed by a forced reconnect: the new socket owns the connection state and the retry. Shut down
      // (disconnectNow, or the server logging us out, which updates the state itself): nothing to do.
      if (socket !== currentSocket || allowDisconnect) {
        return;
      }

      // Closed before the server ever answered: it can't be reached. Only meaningful while online,
      // which ChatRoomList checks, so a close caused by the device going offline does no harm.
      // reconnectAttempts > 0: at least the second failure in a row. The first attempt after the network returns
      // often fails while the connection settles; flagging that flashed "server down" on every reconnect.
      const isServerDown = !hasConnected && reconnectAttempts > 0;
      const update = isServerDown ? {isChatConnected: false, isChatServerDown: true} : {isChatConnected: false};
      dispatch(updateIndicatorList(update));

      // Requests sent on this socket will never be answered; drop them so "load earlier" doesn't spin forever.
      pendingHistoryRooms.clear();
      dispatch(mutation.setLoadingEarlierRoomSuccess(undefined));
      attemptReconnect();
    });

    return socket;
  };

  const attemptReconnect = () => {
    if (reconnectTimeout || allowDisconnect) {return;} // Avoid multiple reconnection attempts

    const reconnectDelay = Math.min(1000 * reconnectAttempts, 30000); // Exponential backoff, max 30 seconds

    reconnectTimeout = setTimeout(() => {
      reconnectTimeout = null;
      reconnectAttempts += 1;
      connectSocket();
    }, reconnectDelay);
  };

  reconnectNow = ({force = false} = {}) => {
    reconnectAttempts = 0;
    if (allowDisconnect) {return;}
    // Open: nothing to do, and a server-down flag set by its failed login is still accurate.
    if (!force && currentSocket?.readyState === WebSocket.OPEN) {return;}

    // Failures recorded while the device was offline say nothing about the server; let the next attempt decide.
    // Cleared before the CONNECTING check too: a backoff attempt already in flight when the network returns
    // otherwise left the stale flag up, flashing "server down" until that attempt's login succeeded.
    dispatch(updateIndicatorList({isChatServerDown: false}));
    if (!force && currentSocket?.readyState === WebSocket.CONNECTING) {return;}

    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;

    const previousSocket = currentSocket;
    connectSocket();
    // Close only after connectSocket() has replaced currentSocket, so the old socket's close handler is ignored.
    previousSocket?.close();
  };

  disconnectNow = ({resumable = true} = {}) => {
    if (allowDisconnect) {
      isPaused = isPaused && resumable;
      return;
    }

    isPaused = resumable;
    allowDisconnect = true;
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
    // Their replies will never be handled now; the close handler skips this cleanup once allowDisconnect is set.
    pendingHistoryRooms.clear();
    dispatch(mutation.setLoadingEarlierRoomSuccess(undefined));
    dispatch(updateIndicatorList({isChatConnected: false}));
    currentSocket?.close();
  };

  resumeNow = () => {
    if (!isPaused) {return;}

    isPaused = false;
    allowDisconnect = false;
    reconnectAttempts = 0;
    connectSocket();
  };

  // Initiate connection
  return connectSocket();
};

// before (ms): load the page of messages older than this, for "load earlier"; omit for the newest page.
export const loadHistoryInRoom = (socket, roomId, patientId, before) => {
  const id = getUniqueId(patientId);
  const isOlderPage = before !== undefined;
  pendingHistoryRooms.set(id, {roomId, liveIds: new Set(), isOlderPage});

  const options = {
    msg: 'method',
    method: 'loadHistory',
    id,
    params: [roomId, isOlderPage ? {$date: before} : null, HISTORY_PAGE_SIZE, {$date: new Date().getTime()}],
  };
  socket.send(JSON.stringify(options));
};

export const sendNewMessage = (socket, newMessage, patientId) => {
  const options = {
    msg: 'method',
    method: 'sendMessage',
    id: getUniqueId(patientId),
    params: [
      {
        rid: newMessage.rid,
        _id: newMessage._id,
        msg: newMessage.text,
      },
    ],
  };
  socket.send(JSON.stringify(options));
};

export const updateMessage = (socket, message, patientId) => {
  const options = {
    msg: 'method',
    method: 'updateMessage',
    id: getUniqueId(patientId),
    params: [{...message}],
  };
  socket.send(JSON.stringify(options));
};

export const unSubscribeEvent = (socket, subId) => {
  const options = {
    msg: 'unsub',
    id: subId,
  };
  socket.send(JSON.stringify(options));
};

export const chatLogout = (socket, id) => {
  const options = {
    msg: 'method',
    method: 'logout',
    id,
  };
  socket.send(JSON.stringify(options));
};

const subscribeChatRoomMessage = (socket, id) => {
  const options = {
    msg: 'sub',
    id,
    name: 'stream-room-messages',
    params: ['__my_messages__', false],
  };
  socket.send(JSON.stringify(options));
};

const subscribeUserLoggedStatus = (socket, id) => {
  const options = {
    msg: 'sub',
    id,
    name: 'stream-notify-logged',
    params: ['user-status', false],
  };
  socket.send(JSON.stringify(options));
};
