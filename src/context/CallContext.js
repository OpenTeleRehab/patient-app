import React, {createContext, useContext, useEffect, useState} from 'react';
import {sendNewMessage, updateMessage} from '../utils/rocketchat';
import RocketchatContext from './RocketchatContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  CALL_ENDED_STATUSES,
  CALL_MISSED_STATUSES,
  CALL_STARTED_STATUSES,
  CALL_STATUS,
  STORAGE_KEY,
} from '../variables/constants';
import {
  clearCallAccessToken,
  clearVideoCallStatus,
  getCallAccessToken,
} from '../store/rocketchat/actions';
import {storeLocalData} from '../utils/local_storage';

const CallContext = createContext(null);

export const useCallContext = () => useContext(CallContext);

export const CallContextProvider = ({children}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const {callAccessToken, chatAuth, videoCall} = useSelector(
    (state) => state.rocketchat,
  );
  const {profile} = useSelector((state) => state.user);
  const [hostUserId, setHostUserId] = useState(undefined);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Call started listener
    if (CALL_STARTED_STATUSES.includes(videoCall.status)) {
      if (videoCall.u._id === chatAuth.userId) {
        setHostUserId(chatAuth.userId);
      } else {
        setHostUserId(undefined);
      }
    }

    // Call accepted listener
    if (videoCall.status === CALL_STATUS.ACCEPTED) {
      if (callAccessToken === undefined) {
        const _id = videoCall._id;
        const rid = videoCall.rid;
        const msg = CALL_STATUS.ACCEPTED;

        // Send accept call message
        if (hostUserId === undefined) {
          updateMessage(chatSocket, {_id, rid, msg}, profile.id);
        }

        // Get call access token
        dispatch(getCallAccessToken(videoCall.u._id));
      }
    }

    // Call busy listener
    if (videoCall.status === CALL_STATUS.BUSY) {
      if (callAccessToken && participants.length === 0) {
        // Clear call access token
        dispatch(clearCallAccessToken());

        // Cleanup video call
        dispatch(clearVideoCallStatus());
      }

      if (callAccessToken === undefined) {
        // Cleanup video call
        dispatch(clearVideoCallStatus());
      }
    }

    // Call missed listener
    if (CALL_MISSED_STATUSES.includes(videoCall.status)) {
      if (callAccessToken && participants.length === 0) {
        // Clear call access token
        dispatch(clearCallAccessToken());

        // Cleanup video call
        dispatch(clearVideoCallStatus());

        // Cleanup call info
        storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
      }

      if (callAccessToken === undefined) {
        // Cleanup video call
        dispatch(clearVideoCallStatus());

        // Cleanup call info
        storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
      }
    }

    // Call ended listener
    if (CALL_ENDED_STATUSES.includes(videoCall.status)) {
      if (callAccessToken === undefined) {
        // Cleanup video call
        dispatch(clearVideoCallStatus());

        // Cleanup call info
        storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
      }
    }
  }, [
    callAccessToken,
    chatAuth,
    chatSocket,
    dispatch,
    hostUserId,
    participants,
    profile,
    videoCall,
  ]);

  const handleCall = (_id, rid, msg) => {
    sendNewMessage(chatSocket, {_id, rid, text: msg}, profile.id);
  };

  const handleAcceptCall = () => {
    const _id = videoCall._id;
    const rid = videoCall.rid;
    const msg = CALL_STATUS.ACCEPTED;

    // Send accept call message
    updateMessage(chatSocket, {_id, rid, msg}, profile.id);

    // Get call access token
    dispatch(getCallAccessToken(videoCall.u._id));

    // Cleanup call info from local storage
    storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
  };

  const handleDeclineCall = (_id, rid, msg) => {
    updateMessage(chatSocket, {_id, rid, msg}, profile.id);
  };

  const handleEndCall = (_id, rid, msg) => {
    updateMessage(chatSocket, {_id, rid, msg}, profile.id);
  };

  const handleSetParticipants = (items) => {
    setParticipants(items);
  };

  return (
    <CallContext.Provider
      value={{
        hostUserId,
        participants,
        handleCall,
        handleAcceptCall,
        handleDeclineCall,
        handleEndCall,
        handleSetParticipants,
      }}>
      {children}
    </CallContext.Provider>
  );
};
