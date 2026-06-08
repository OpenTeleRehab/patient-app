/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import _ from 'lodash';
import {initialState} from './states';

export const rocketchat = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_INCOME_CALL': {
      return Object.assign({}, state, {
        showIncomingCall: action.data,
      });
    }
    case 'SHOW_ACCEPTED_CALL': {
      return Object.assign({}, state, {
        showAcceptedCall: action.data,
      });
    }
    case 'HAS_STARTED_CALL': {
      return Object.assign({}, state, {
        hasStartedCall: action.data,
      });
    }
    case 'HAS_ACCEPTED_CALL': {
      return Object.assign({}, state, {
        hasAcceptedCall: action.data,
      });
    }
    case 'SET_CHAT_SUBSCRIBE_IDS_SUCCEED': {
      return Object.assign({}, state, {
        subscribeIds: action.data,
      });
    }
    case 'SET_OFFLINE_MESSAGES_SUCCEED': {
      return Object.assign({}, state, {
        offlineMessages: action.data,
      });
    }
    case 'CHAT_USER_LOGIN_SUCCEED': {
      return Object.assign({}, state, {
        chatAuth: action.data,
      });
    }
    case 'GET_CHAT_ROOMS_REQUEST': {
      return Object.assign({}, state, {
        isLoading: true,
      });
    }
    case 'GET_CHAT_ROOMS_SUCCEED': {
      return Object.assign({}, state, {
        chatRooms: action.data,
        isLoading: false,
      });
    }
    case 'GET_CHAT_ROOMS_FAILED': {
      return Object.assign({}, state, {
        isLoading: false,
      });
    }
    case 'GET_CALL_ACCESS_TOKEN_SUCCEED': {
      return Object.assign({}, state, {
        callAccessToken: action.token,
      });
    }
    case 'GET_MESSAGES_IN_ROOM_SUCCEED': {
      return Object.assign({}, state, {
        messages: action.data,
      });
    }
    case 'SELECT_ROOM_SUCCEED': {
      return Object.assign({}, state, {
        selectedRoom: _.pick(action.data, [
          'enabled',
          'name',
          'rid',
          'u',
          'totalMessages',
          'unreads',
        ]),
      });
    }
    case 'PREPEND_NEW_MESSAGE_SUCCEED': {
      const chatRooms = [...state.chatRooms];
      const crIndex = chatRooms.findIndex((item) => item.rid === action.data.rid);
      const msgIndex = chatRooms[crIndex].messages.findIndex((item) => item._id === action.data._id);
      const existingMsg = chatRooms[crIndex].messages.find((item) => item._id === action.data._id);

      if (existingMsg) {
        chatRooms[crIndex].messages[msgIndex].text = action.data.text;
      } else {
        chatRooms[crIndex].messages = [action.data, ...chatRooms[crIndex].messages];
      }

      return Object.assign({}, state, {
        messages: chatRooms[crIndex].messages,
        chatRooms: [...chatRooms],
      });
    }
    case 'UPDATE_LAST_MESSAGE_SUCCESS': {
      const chatRooms = state.chatRooms.map((item) =>
        item.rid === action.data.rid
          ? {...item, lastMessage: action.data}
          : item
      );

      return Object.assign({}, state, {
        chatRooms: [...chatRooms],
      });
    }
    case 'UPDATE_UNREAD_SUCCEED': {
      return Object.assign({}, state, {
        chatRooms: state.chatRooms.map((room) =>
          room.rid === action.rid ? {...room, unreads: false} : room,
        ),
      });
    }
    case 'UPDATE_VIDEO_CALL_STATUS_SUCCEED': {
      return Object.assign({}, state, {
        videoCall: action.data,
      });
    }
    case 'CLEAR_CALL_ACCESS_TOKEN_SUCCESS': {
      return Object.assign({}, state, {
        callAccessToken: undefined,
      });
    }
    case 'CLEAR_OFFLINE_MESSAGES_SUCCEED': {
      return Object.assign({}, state, {
        offlineMessages: [],
      });
    }
    default:
      return state;
  }
};
