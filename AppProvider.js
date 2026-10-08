/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from './src/components/SplashScreen';
import {getTranslations} from './src/store/translation/actions';
import {loginRequest, setInitialRouteName} from './src/store/user/actions';
import {ROUTES, STORAGE_KEY, TRANSFER_STATUS} from './src/variables/constants';
import {getLocalData, storeLocalData} from './src/utils/local_storage';
import moment from 'moment';
import settings from './config/settings';
import RocketchatContext from './src/context/RocketchatContext';
import {
  disconnectChatSocket,
  initialChatSocket,
  reconnectChatSocket,
  waitForChatLogin,
} from './src/utils/rocketchat';
import {getUniqueId} from './src/utils/helper';
import {
  acceptCallHandler,
  rejectCallHandler,
  setChatSubscribeIds,
} from './src/store/rocketchat/actions';
import {addTranslationForLanguage, getTranslate} from 'react-localize-redux';
import RNCallKeep from 'react-native-callkeep';
import {Alert, Platform} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {forceLogout} from './src/store/auth/actions';
import {
  completeActive,
  completeGoal,
  completeQuestionnaire,
} from './src/store/activity/actions';
import {updateIndicatorList} from './src/store/indicator/actions';
import {
  requestCallPermission,
  requestNotificationPermission,
} from './src/utils/permission';
import {syncPatientOffline, syncOfflineRemovePendingSupplementary} from './src/store/patient/actions';
import {acceptedRequest} from './src/store/call/actions';
import {useAppointmentNotifications} from './src/hook/useAppointmentNotifications';
import {useGetChatRooms} from './src/hook/useGetChatRooms';
import {mutation as rocketchatMutation} from './src/store/rocketchat/mutations';

let chatSocket = null;

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
  const {accessToken, profile, isDataUpToDate} = useSelector(
    (state) => state.user,
  );
  const {messages} = useSelector((state) => state.translation);
  const {chatAuth, chatOwnerId} = useSelector((state) => state.rocketchat);
  const {transfers} = useSelector((state) => state.transfer);
  const localize = useSelector((state) => state.localize);
  const {offlineQuestionnaireAnswers, offlineActivities, offlineGoals} =
    useSelector((state) => state.activity);
  const translate = getTranslate(localize);
  const [loading, setLoading] = useState(true);
  const [timespan, setTimespan] = useState('');
  const [language, setLanguage] = useState(undefined);
  const [socket, setSocket] = useState(null);
  const isOnline = useNetInfo().isConnected;
  const isRelogging = useRef(false);

  // Chat data is persisted without logout clearing it (keeping it lets the same user read chats offline), so
  // when a different account signs in (re-register, login with another email/number) drop the previous one's.
  const chatUserId = profile?.chat_user_id;

  // Offline login holds a placeholder token; wait for the re-login before syncing
  const canSync = isOnline && accessToken && isDataUpToDate !== false;

  // Trigger appointment notifications
  useAppointmentNotifications(dispatch, profile);

  // Get chat rooms
  useGetChatRooms(
    dispatch,
    accessToken,
    chatAuth,
    isDataUpToDate,
    profile?.chat_user_id,
  );

  useEffect(() => {
    if (!chatUserId || chatUserId === chatOwnerId) {
      return;
    }

    if (chatOwnerId === undefined) {
      // Data saved before ownership was tracked: almost certainly this user's, so adopt it rather than wipe
      // their cached chats and queued messages.
      dispatch(rocketchatMutation.setChatOwnerSuccess(chatUserId));
    } else {
      dispatch(rocketchatMutation.resetChatDataSuccess(chatUserId));
    }
  }, [chatOwnerId, chatUserId, dispatch]);

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.AUTH_INFO, true);
    const lang = await getLocalData(STORAGE_KEY.LANGUAGE);

    if (data) {
      setTimespan(data.timespan);
    }

    setLanguage(lang || 1);
  }, []);

  const answerCall = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await storeLocalData(STORAGE_KEY.ACCEPTED_CALL, 'true');
    }

    if (accessToken && socket) {
      await storeLocalData(STORAGE_KEY.ACCEPTED_CALL, 'false');
      await dispatch(acceptedRequest(true));

      waitForChatLogin().then((loggedInSocket) => {
        dispatch(acceptCallHandler(loggedInSocket));
      });
    }
  }, [accessToken, dispatch, socket]);

  const endCall = useCallback(() => {
    dispatch(rejectCallHandler(socket));
  }, [dispatch, socket]);

  useEffect(() => {
    const answerCallListener = RNCallKeep.addEventListener('answerCall', answerCall);
    const endCallListener = RNCallKeep.addEventListener('endCall', endCall);

    return () => {
      answerCallListener.remove();
      endCallListener.remove();
    };
  }, [answerCall, endCall]);

  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();

    if (accessToken) {
      // Request phone call permission
      requestCallPermission();
    }
  }, [accessToken]);

  useEffect(() => {
    dispatch(updateIndicatorList({isOnlineMode: isOnline}));

    if (isOnline) {
      reconnectChatSocket();
    }
  }, [dispatch, isOnline]);

  useEffect(() => {
    fetchLocalData();
  }, [fetchLocalData, dispatch]);

  useEffect(() => {
    if (timespan) {
      if (moment().diff(moment(timespan, settings.format.date), 'days') > 0) {
        dispatch(setInitialRouteName(ROUTES.REGISTER));
      } else {
        dispatch(setInitialRouteName(ROUTES.LOGIN));
      }
    }
  }, [timespan, dispatch]);

  useEffect(() => {
    dispatch(addTranslationForLanguage(messages, 'en'));
  }, [messages, dispatch]);

  useEffect(() => {
    if (loading && language) {
      dispatch(getTranslations(language)).then(() => {
        setLoading(false);
      });
    }
  }, [dispatch, loading, language]);

  const {
    id: profileId,
    identity: chatUsername,
    chat_password: chatPassword,
  } = profile || {};

  // Keyed on the chat credentials, not the profile object: the re-login after an offline login (or a PIN login)
  // replaces profile, which used to open a second socket (and a second chat login + room load) beside the first.
  // The same user's live session is kept, so an accepted call is sent right away.
  useEffect(() => {
    if (!profileId || !chatUsername || !chatPassword) {
      return undefined;
    }

    const subscribeIds = {
      loginId: getUniqueId(profileId),
      roomMessageId: getUniqueId(profileId),
      notifyLoggedId: getUniqueId(profileId),
    };

    // Set chat subscribe ids
    dispatch(setChatSubscribeIds(subscribeIds));

    // Initial chat socket
    const timeout = setTimeout(() => {
      chatSocket = initialChatSocket(
        dispatch,
        subscribeIds,
        chatUsername,
        chatPassword,
        (newSocket) => {
          chatSocket = newSocket; // Update the reference
          setSocket(newSocket);
        },
      );
    }, 1000);

    // Account switch (new chat credentials) or unmount: shut this user's socket down before the next one starts.
    // Left open it kept reconnecting as the previous user, and a credentials change within the 1s delay
    // used to start two sockets.
    return () => {
      clearTimeout(timeout);
      disconnectChatSocket({resumable: false});
      chatSocket = null;
      setSocket(null);
    };
  }, [dispatch, profileId, chatUsername, chatPassword]);

  useEffect(() => {
    const hasTransfer = transfers.some(
      (item) =>
        item.to_therapist_id === profile.id &&
        item.status === TRANSFER_STATUS.INVITED,
    );
    dispatch(updateIndicatorList({hasTransfer}));
  }, [dispatch, profile.id, transfers]);

  useEffect(() => {
    if (isOnline && chatSocket) {
      getLocalData(STORAGE_KEY.ACCEPTED_CALL).then(async (acceptedCall) => {
        if (JSON.parse(acceptedCall)) {
          await storeLocalData(STORAGE_KEY.ACCEPTED_CALL, 'false');
          await dispatch(acceptedRequest(true));
        }

        // Session may already be logged in, so mark the call accepted before sending
        if (accessToken) {
          const loggedInSocket = await waitForChatLogin();
          dispatch(acceptCallHandler(loggedInSocket));
        }
      });
    }

    return undefined;
  }, [accessToken, dispatch, isOnline]);

  useEffect(() => {
    if (isOnline && isDataUpToDate === false && !isRelogging.current) {
      // Refresh the session restored offline; log out only if the server rejects it
      isRelogging.current = true;
      dispatch(loginRequest())
        .then(({isRejected}) => {
          if (isRejected) {
            dispatch(forceLogout());
            Alert.alert(translate('user.session'), translate('user.session_expired'));
          }
        })
        .catch((error) => console.error(error))
        .finally(() => {
          isRelogging.current = false;
        });
    }
  }, [dispatch, isOnline, isDataUpToDate, translate]);

  useEffect(() => {
    if (canSync) {
      dispatch(syncPatientOffline());
      dispatch(syncOfflineRemovePendingSupplementary());
    }
  }, [canSync, dispatch]);

  useEffect(() => {
    if (canSync && offlineQuestionnaireAnswers.length) {
      dispatch(completeQuestionnaire(offlineQuestionnaireAnswers));
    }
  }, [dispatch, canSync, offlineQuestionnaireAnswers]);

  useEffect(() => {
    if (canSync && offlineActivities.length) {
      dispatch(completeActive(offlineActivities));
    }
  }, [dispatch, canSync, offlineActivities]);

  useEffect(() => {
    if (canSync && offlineGoals.length) {
      dispatch(completeGoal(offlineGoals));
    }
  }, [dispatch, canSync, offlineGoals]);

  return loading ? (
    <SplashScreen />
  ) : (
    <RocketchatContext.Provider value={chatSocket}>
      {children}
    </RocketchatContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node,
};

export default AppProvider;
