import {
  authenticateChatUser,
  getChatRooms,
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

  const connectSocket = () => {
    const socket = new WebSocket(store.getState().phone.chatWebsocketURL);

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
      const response = JSON.parse(e.data);
      const {id, result, error, collection, fields} = response;
      const resMessage = response.msg;

      if (resMessage === 'ping') {
        // Keep connection alive
        socket.send(JSON.stringify({msg: 'pong'}));
      } else if (resMessage === 'connected') {
        // Connection success => login
        dispatch(updateIndicatorList({isChatConnected: true}));

        Rocketchat.login(username, {
          digest: password,
          algorithm: 'sha-256',
        }).then((res) => {
          if (res.data) {
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
        } else if (id === loginId && result) {
          // Login success, and set auth token
          const {token, tokenExpires} = result;
          const expiredAt = new Date(tokenExpires.$date);
          userId = result.id;
          authToken = token;
          dispatch(authenticateChatUser({userId, token, expiredAt}));

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

          // Get chat rooms
          dispatch(getChatRooms());
        } else if (result && result.messages) {
          // Load messages in a room
          const {chatRooms} = store.getState().rocketchat;

          const allMessages = [];

          if (result.messages.length > 0) {
            result.messages.forEach((message) => {
              allMessages.push(getChatMessage(message, userId, authToken));
            });

            const roomId = result.messages[0].rid;
            const fIndex = chatRooms.findIndex((cr) => cr.rid === roomId);

            if (fIndex !== -1) {
              chatRooms[fIndex].messages = allMessages;
            }

            dispatch(mutation.getChatRoomsSuccess(chatRooms));
          }

          dispatch(mutation.getMessagesInRoomSuccess(allMessages));
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
                  startAt: Date.now(),
                }),
              );
            }
          }

          const newMessage = getChatMessage(fields.args[0], userId, authToken);

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
      dispatch(updateIndicatorList({isChatConnected: false}));
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

  // Initiate connection
  return connectSocket();
};

export const loadHistoryInRoom = (socket, roomId, patientId) => {
  const options = {
    msg: 'method',
    method: 'loadHistory',
    id: getUniqueId(patientId),
    params: [roomId, null, 500, {$date: new Date().getTime()}],
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
