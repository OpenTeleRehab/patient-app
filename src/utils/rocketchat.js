import {
  authenticateChatUser,
  getMessagesInRoom,
  prependNewMessage,
  updateChatUserStatus,
  clearChatData,
} from '../store/rocketchat/actions';
import {CHAT_USER_STATUS} from '../variables/constants';
import {getUniqueId} from './helper';
import settings from '../../config/settings';
import {
  updateIndicatorList,
  updateUnreadMessageIndicator,
} from '../store/indicator/actions';

export const initialChatSocket = (
  dispatch,
  subscribeIds,
  username,
  password,
) => {
  let isConnected = false;
  const {loginId, roomMessageId, notifyLoggedId} = subscribeIds;

  // register websocket
  const socket = new WebSocket(settings.chatWebsocketUrl);

  // observer
  socket.onclose = (e) => {
    if (e.target.readyState === socket.CLOSED) {
      dispatch(updateIndicatorList({isChatConnected: false}));
      dispatch(clearChatData());
    }
  };
  socket.onmessage = (e) => {
    const response = JSON.parse(e.data);
    const {id, result, error, collection, fields} = response;
    const resMessage = response.msg;

    // create connection
    if (!isConnected && resMessage === undefined && socket.readyState === 1) {
      isConnected = true;
      const options = {
        msg: 'connect',
        version: '1',
        support: ['1', 'pre2', 'pre1'],
      };
      socket.send(JSON.stringify(options));
    }

    if (resMessage === 'ping') {
      // Keep connection alive
      socket.send(JSON.stringify({msg: 'pong'}));
    } else if (resMessage === 'connected') {
      // connection success => login
      dispatch(updateIndicatorList({isChatConnected: true}));
      const options = {
        msg: 'method',
        method: 'login',
        id: loginId,
        params: [
          {
            user: {username},
            password: {
              digest: password,
              algorithm: 'sha-256',
            },
          },
        ],
      };
      socket.send(JSON.stringify(options));
    } else if (resMessage === 'result') {
      if (error !== undefined) {
        console.error(`Websocket: ${error.reason}`);
      } else if (id === loginId && result) {
        // login success

        // set auth token
        const {token, tokenExpires} = result;
        const expiredAt = new Date(tokenExpires.$date);
        dispatch(authenticateChatUser({userId: result.id, token, expiredAt}));

        // subscribe chat room message
        subscribeChatRoomMessage(socket, roomMessageId);

        // subscribe to user logged status (patient)
        setTimeout(() => {
          subscribeUserLoggedStatus(socket, notifyLoggedId);
        }, 1000);
      } else if (result && result.messages) {
        // load messages in a room
        const allMessages = [];
        result.messages.forEach((message) => {
          const {_id, msg, ts, u} = message;
          allMessages.push({
            _id,
            text: msg,
            createdAt: new Date(ts.$date),
            user: {_id: u._id},
            sent: true,
            pending: false,
          });
        });
        dispatch(getMessagesInRoom(allMessages));
      }
    } else if (resMessage === 'changed') {
      if (collection === 'stream-room-messages') {
        // trigger change in chat room
        const {_id, rid, msg, ts, u} = fields.args[0];
        const newMessage = {
          _id,
          rid,
          text: msg,
          createdAt: new Date(ts.$date),
          user: {_id: u._id},
          received: true,
          pending: false,
          unread: 0,
        };
        dispatch(prependNewMessage(newMessage));
        dispatch(updateUnreadMessageIndicator());
      } else if (collection === 'stream-notify-logged') {
        // trigger user logged status
        const res = fields.args[0];
        const data = {
          _id: res[0],
          username: res[1],
          status: CHAT_USER_STATUS[res[2]],
        };
        dispatch(updateChatUserStatus(data));
      }
    } else if (resMessage === 'removed' && collection === 'users') {
      // close connection on logout
      socket.close();
    }
  };

  return socket;
};

// TODO set specific iterm per page on first load with infinite scroll
export const loadHistoryInRoom = (socket, roomId, patientId) => {
  const options = {
    msg: 'method',
    method: 'loadHistory',
    id: getUniqueId(patientId),
    params: [roomId, null, 999999, {$date: new Date().getTime()}],
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
