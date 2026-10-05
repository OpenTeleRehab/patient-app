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
      const room = state.chatRooms.find((item) => item.rid === action.data.rid);

      if (!room) {
        return state;
      }

      const isExisting = room.messages.some((item) => item._id === action.data._id);
      const messages = isExisting
        ? room.messages.map((item) =>
            // The server echo of a queued message carries pending: false, which clears its "sending" clock.
            item._id === action.data._id
              ? {
                  ...item,
                  text: action.data.text,
                  pending: action.data.pending,
                  received: action.data.received,
                }
              : item,
          )
        : [action.data, ...room.messages];

      return Object.assign({}, state, {
        chatRooms: state.chatRooms.map((item) =>
          item.rid === room.rid ? {...item, messages} : item,
        ),
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
          room.rid === action.rid ? {...room, unreads: 0} : room,
        ),
      });
    }
    case 'INCREMENT_UNREAD_SUCCEED': {
      return Object.assign({}, state, {
        chatRooms: state.chatRooms.map((room) =>
          room.rid === action.rid
            ? {...room, unreads: (room.unreads || 0) + 1}
            : room,
        ),
      });
    }
    case 'UPDATE_CHAT_USER_STATUS_SUCCEED': {
      return Object.assign({}, state, {
        chatRooms: state.chatRooms.map((room) =>
          room.u._id === action.data._id
            ? {...room, u: {...room.u, status: action.data.status}}
            : room,
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
    case 'SET_ROOM_MESSAGES_SUCCEED': {
      const room = state.chatRooms.find((item) => item.rid === action.rid);

      if (!room) {
        return state;
      }

      // The server's history is a snapshot without messages still on their way (queued offline, uploading) or
      // streamed in while it was loading (liveIds); keep those on top, or they'd vanish from the chat meanwhile.
      const serverIds = new Set(action.messages.map((item) => item._id));
      const liveIds = new Set(action.liveIds);
      const localMessages = room.messages || [];
      const kept = localMessages.filter(
        (item) => !serverIds.has(item._id) && (item.pending || liveIds.has(item._id)),
      );
      // A message edited while loading (e.g. a call's status) may still have its old text in the snapshot.
      const localById = new Map(localMessages.map((item) => [item._id, item]));
      const serverMessages = action.messages.map((item) =>
        liveIds.has(item._id) ? localById.get(item._id) ?? item : item,
      );

      // This is only the newest page. Keep older saved messages (offline reading, already-loaded earlier pages)
      // only when they're known to continue it, i.e. the page's oldest message is among them; otherwise there
      // may be a gap, which "load earlier" (paging from the oldest message shown) would never fill.
      let older = [];
      if (action.hasMore && serverMessages.length) {
        const oldestIndex = localMessages.findIndex(
          (item) => item._id === serverMessages[serverMessages.length - 1]._id,
        );
        if (oldestIndex !== -1) {
          older = localMessages.slice(oldestIndex + 1).filter((item) => !serverIds.has(item._id));
        }
      }
      const messages = [...kept, ...serverMessages, ...older];

      return Object.assign({}, state, {
        chatRooms: state.chatRooms.map((item) =>
          item.rid === action.rid ? {...item, messages, hasMoreHistory: action.hasMore} : item,
        ),
      });
    }
    case 'APPEND_OLDER_ROOM_MESSAGES_SUCCEED': {
      return Object.assign({}, state, {
        loadingEarlierRoomId: undefined,
        chatRooms: state.chatRooms.map((item) => {
          if (item.rid !== action.rid) {
            return item;
          }

          const existingIds = new Set((item.messages || []).map((message) => message._id));
          const olderMessages = action.messages.filter((message) => !existingIds.has(message._id));

          return {
            ...item,
            messages: [...(item.messages || []), ...olderMessages],
            hasMoreHistory: action.hasMore,
          };
        }),
      });
    }
    case 'SET_CHAT_OWNER_SUCCEED': {
      return Object.assign({}, state, {
        chatOwnerId: action.chatUserId,
      });
    }
    case 'RESET_CHAT_DATA_SUCCEED': {
      // Another account signed in: drop everything of the previous chat user. Their queued offline messages
      // must not be sent from this account, and chatAuth (still theirs until the new chat login) must not load rooms.
      return Object.assign({}, state, {
        chatOwnerId: action.chatUserId,
        chatRooms: [],
        offlineMessages: [],
        selectedRoom: undefined,
        chatAuth: undefined,
        loadingEarlierRoomId: undefined,
        isLoading: false,
      });
    }
    case 'SET_LOADING_EARLIER_ROOM_SUCCEED': {
      return Object.assign({}, state, {
        loadingEarlierRoomId: action.rid,
      });
    }
    case 'REMOVE_MESSAGE_SUCCEED': {
      const removeMessage = (messages = []) => messages.filter((item) => item._id !== action.data._id);

      return Object.assign({}, state, {
        chatRooms: state.chatRooms.map((item) =>
          item.rid === action.data.rid ? {...item, messages: removeMessage(item.messages)} : item,
        ),
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
