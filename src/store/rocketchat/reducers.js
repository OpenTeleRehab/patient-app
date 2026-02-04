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
    case 'GET_CHAT_ROOMS_SUCCEED': {
      return Object.assign({}, state, {
        chatRooms: action.data,
      });
    }
    case 'GET_LAST_MESSAGES_SUCCEED': {
      return Object.assign({}, state, {
        chatRooms: action.data,
      });
    }
    case 'GET_CHAT_USERS_STATUS_SUCCEED': {
      return Object.assign({}, state, {
        chatRooms: action.data,
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
    case 'PREPEND_NEW_MESSAGE_SUCCEED':
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
    case 'CLEAR_CHAT_DATA_SUCCEED':
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
