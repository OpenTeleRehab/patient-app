import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AppState} from 'react-native';
import {getTranslate} from 'react-localize-redux';
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
  updateTextMessage,
} from '../store/rocketchat/actions';
import {getLocalData, storeLocalData} from '../utils/local_storage';
import {mutation} from '../store/rocketchat/mutations';
import {acceptedRequest} from '../store/call/actions';
import {useShowToast} from '../hook/useShowToast';
import _ from 'lodash';

const CallContext = createContext(null);

export const useCallContext = () => useContext(CallContext);

export const CallContextProvider = ({children}) => {
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const chatSocket = useContext(RocketchatContext);
  const {showToast} = useShowToast();
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
    // Call started listener
    const onStartedCallEvent = async () => {
      const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);

      if (
        CALL_STARTED_STATUSES.includes(videoCall.status) &&
        videoCall.u._id !== chatAuth.userId &&
        _.isEmpty(callInfo) &&
        !hasStartedCall &&
        !hasAcceptedCall
      ) {
        dispatch(mutation.showIncomingCall(true));
      }
    };

    // Call accepted listener
    const onAcceptCallEvent = async () => {
      if (videoCall.status === CALL_STATUS.ACCEPTED) {
        if (!callAccessToken && hasStartedCall) {
          dispatch(getCallAccessToken(videoCall.u._id));

          dispatch(mutation.showIncomingCall(false));
          dispatch(mutation.showAcceptedCall(true));
        }

        if (!callAccessToken && !hasStartedCall && !hasAcceptedCall) {
          dispatch(mutation.showIncomingCall(false));

          dispatch(clearVideoCallStatus());
        }
      }
    };

    // Call busy listener
    const onBusyCallEvent = async () => {
      if (videoCall.status === CALL_STATUS.BUSY) {
        // Show busy toast
        handleShowToast(videoCall.status);

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
      if (CALL_MISSED_STATUSES.includes(videoCall.status) && !hasParticipant) {
        dispatch(mutation.showIncomingCall(false));
        dispatch(mutation.hasAcceptedCall(false));
        dispatch(mutation.hasStartedCall(false));

        dispatch(clearCallAccessToken());
        dispatch(clearVideoCallStatus());

        await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);
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
    }

    onAcceptCallEvent().then();
    onMissedCallEvent().then();
    onBusyCallEvent().then();
    onEndedCallEvent().then();
  }, [
    accessToken,
    appStateVisible,
    callAccessToken,
    chatAuth,
    chatSocket,
    dispatch,
    handleShowToast,
    hasAcceptedCall,
    hasParticipant,
    hasStartedCall,
    profile.id,
    videoCall,
  ]);

  const handleShowToast = useCallback(
    (message) => {
      showToast(translate(message));
    },
    [showToast, translate],
  );

  const handleAcceptCall = async () => {
    dispatch(mutation.showIncomingCall(false));
    dispatch(mutation.hasAcceptedCall(true));

    if (accessToken) {
      const message = {
        _id: videoCall._id,
        rid: videoCall.rid,
        user: {
          _id: profile.chat_user_id,
          username: profile.identity,
        },
        text: CALL_STATUS.ACCEPTED,
      };

      dispatch(updateTextMessage(chatSocket, message));
      dispatch(getCallAccessToken(videoCall.u._id));
      dispatch(mutation.showAcceptedCall(true));
    } else {
      const callInfo = {
        _id: videoCall._id,
        rid: videoCall.rid,
        body: videoCall.status,
      };

      dispatch(acceptedRequest(true));
      await storeLocalData(STORAGE_KEY.CALL_INFO, callInfo, true);
    }
  };

  const handleDeclineCall = (_id, rid, msg) => {
    updateMessage(chatSocket, {_id, rid, msg}, profile.id);
  };

  return (
    <CallContext.Provider
      value={{
        hasParticipant,
        setHasParticipant,
        handleAcceptCall,
        handleDeclineCall,
      }}>
      {children}
    </CallContext.Provider>
  );
};
