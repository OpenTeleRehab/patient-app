import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AppState} from 'react-native';
import {updateMessage} from '../utils/rocketchat';
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
  sendPodcastNotification,
} from '../store/rocketchat/actions';
import {getLocalData, storeLocalData} from '../utils/local_storage';
import {mutation} from '../store/rocketchat/mutations';
import {requestCallPermission} from '../utils/permission';
import _ from 'lodash';

const CallContext = createContext(null);

export const useCallContext = () => useContext(CallContext);

export const CallContextProvider = ({children}) => {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const {
    callAccessToken,
    chatAuth,
    videoCall,
    hasStartedCall,
    hasAcceptedCall,
  } = useSelector((state) => state.rocketchat);
  const {accessToken, profile} = useSelector((state) => state.user);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [hasParticipant, setHasParticipant] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      // Request phone call permission
      requestCallPermission();
    }
  }, [accessToken]);

  useEffect(() => {
    if (_.isEmpty(videoCall)) {
      dispatch(mutation.showIncomingCall(false));
      dispatch(mutation.showAcceptedCall(false));

      dispatch(mutation.hasStartedCall(false));
      dispatch(mutation.hasAcceptedCall(false));
    }
  }, [dispatch, videoCall]);

  useEffect(() => {
    // Call started listener
    const onStartedCallEvent = async () => {
      const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);

      if (CALL_STARTED_STATUSES.includes(videoCall.status)) {
        if (
          videoCall.u._id !== chatAuth.userId &&
          _.isEmpty(callInfo) &&
          !hasStartedCall &&
          !hasAcceptedCall
        ) {
          dispatch(mutation.showIncomingCall(true));
        }
      }
    };

    // Call accepted listener
    const onAcceptCallEvent = async () => {
      const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);

      if (
        !callAccessToken &&
        accessToken &&
        videoCall.status === CALL_STATUS.ACCEPTED
      ) {
        if (!hasStartedCall) {
          const _id = videoCall._id;
          const rid = videoCall.rid;
          const msg = CALL_STATUS.ACCEPTED;

          // Send accept call message
          updateMessage(chatSocket, {_id, rid, msg}, profile.id);
        }

        if (hasAcceptedCall || hasStartedCall || callInfo.callUUID) {
          // Get call access token
          dispatch(getCallAccessToken(videoCall.u._id));

          // Send accepted call notification
          dispatch(
            sendPodcastNotification({
              _id: videoCall._id,
              rid: videoCall.rid,
              identity: profile.identity,
              title: profile.last_name + ' ' + profile.first_name,
              body: CALL_STATUS.ACCEPTED,
            }),
          );

          dispatch(mutation.showIncomingCall(false));
          dispatch(mutation.showAcceptedCall(true));
        } else {
          // Cleanup video call
          dispatch(clearVideoCallStatus());
        }
      }
    };

    // Call busy listener
    const onBusyCallEvent = async () => {
      if (videoCall.status === CALL_STATUS.BUSY) {
        if (callAccessToken && !hasParticipant) {
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
    };

    // Call missed listener
    const onMissedCallEvent = async () => {
      if (CALL_MISSED_STATUSES.includes(videoCall.status)) {
        if (callAccessToken && !hasParticipant) {
          // Clear call access token
          dispatch(clearCallAccessToken());

          // Cleanup video call
          dispatch(clearVideoCallStatus());
        }

        if (callAccessToken === undefined) {
          // Cleanup video call
          dispatch(clearVideoCallStatus());

          // Cleanup call info
          storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
        }
      }
    };

    // Call ended listener
    const onEndedCallEvent = async () => {
      if (CALL_ENDED_STATUSES.includes(videoCall.status)) {
        if (callAccessToken === undefined) {
          // Cleanup video call
          dispatch(clearVideoCallStatus());
        }
      }
    };

    if (appStateVisible === 'active') {
      onStartedCallEvent().then();
      onAcceptCallEvent().then();
      onBusyCallEvent().then();
      onMissedCallEvent().then();
      onEndedCallEvent().then();
    }
  }, [
    accessToken,
    appStateVisible,
    callAccessToken,
    chatAuth,
    chatSocket,
    dispatch,
    hasAcceptedCall,
    hasParticipant,
    hasStartedCall,
    profile.first_name,
    profile.id,
    profile.identity,
    profile.last_name,
    videoCall,
  ]);

  const handleAcceptCall = () => {
    const _id = videoCall._id;
    const rid = videoCall.rid;
    const msg = CALL_STATUS.ACCEPTED;

    // Send accept call message
    updateMessage(chatSocket, {_id, rid, msg}, profile.id);

    dispatch(mutation.showIncomingCall(false));
    dispatch(mutation.hasAcceptedCall(true));

    if (accessToken) {
      dispatch(mutation.showAcceptedCall(true));
    } else {
      dispatch(mutation.showAcceptedCall(false));
    }
  };

  const handleDeclineCall = (_id, rid, msg) => {
    updateMessage(chatSocket, {_id, rid, msg}, profile.id);
  };

  const handlePushNotification = (notification) => {
    dispatch(sendPodcastNotification(notification));
  };

  return (
    <CallContext.Provider
      value={{
        hasParticipant,
        setHasParticipant,
        handleAcceptCall,
        handleDeclineCall,
        handlePushNotification,
      }}>
      {children}
    </CallContext.Provider>
  );
};
