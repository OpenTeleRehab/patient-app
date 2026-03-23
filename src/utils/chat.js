import _ from 'lodash';
import store from '../store';
import {CALL_STARTED_STATUSES, CALL_STATUS} from '../variables/constants';

export const getPatientChatRooms = () => {
  const {chatRooms} = store.getState().rocketchat;

  if (chatRooms?.length > 0) {
    return _.filter(chatRooms, (room) => {
      const username = room.u.username;
      return !username.startsWith('T') && !username.startsWith('PHC');
    });
  }

  return [];
};

export const getTherapistChatRooms = () => {
  const {chatRooms} = store.getState().rocketchat;

  if (chatRooms?.length > 0) {
    return _.filter(chatRooms, (room) => {
      return room.u.username.startsWith('T');
    });
  }

  return [];
};

export const getPhcChatRooms = () => {
  const {chatRooms} = store.getState().rocketchat;

  if (chatRooms?.length > 0) {
    return _.filter(chatRooms, (room) => {
      return room.u.username.startsWith('PHC');
    });
  }

  return [];
};

export const checkCallBusy = (userId, msg) => {
  const {chatAuth, showIncomingCall, showAcceptedCall} = store.getState().rocketchat;

  return (
    chatAuth.userId !== userId &&
    (showIncomingCall || showAcceptedCall) &&
    [...CALL_STARTED_STATUSES, CALL_STATUS.BUSY].includes(msg)
  );
};

export const formatCallDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
};
