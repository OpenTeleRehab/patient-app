/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from './src/components/SplashScreen';
import {getTranslations} from './src/store/translation/actions';
import {setInitialRouteName} from './src/store/user/actions';
import {ROUTES, STORAGE_KEY, TRANSFER_STATUS} from './src/variables/constants';
import {getLocalData, storeLocalData} from './src/utils/local_storage';
import moment from 'moment';
import settings from './config/settings';
import RocketchatContext from './src/context/RocketchatContext';
import {initialChatSocket} from './src/utils/rocketchat';
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
import store from './src/store';
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
import {syncPatientOffline} from './src/store/patient/actions';
import {acceptedRequest} from './src/store/call/actions';
import {useAppointmentNotifications} from './src/hook/useAppointmentNotifications';
import {useGetChatRooms} from './src/hook/useGetChatRooms';

let chatSocket = null;

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
  const {accessToken, profile, isDataUpToDate} = useSelector(
    (state) => state.user,
  );
  const {messages} = useSelector((state) => state.translation);
  const {callAccessToken, chatAuth, chatRooms} = useSelector((state) => state.rocketchat);
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

  // Trigger appointment notifications
  useAppointmentNotifications(dispatch, profile);

  // Get chat rooms
  useGetChatRooms(dispatch, accessToken, chatAuth);

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

      dispatch(acceptCallHandler(socket));
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

  useEffect(() => {
    if (profile && profile.id && profile.identity && profile.chat_password) {
      const subscribeIds = {
        loginId: getUniqueId(profile.id),
        roomMessageId: getUniqueId(profile.id),
        notifyLoggedId: getUniqueId(profile.id),
      };

      // Set chat subscribe ids
      dispatch(setChatSubscribeIds(subscribeIds));

      // Initial chat socket
      setTimeout(() => {
        chatSocket = initialChatSocket(
          dispatch,
          subscribeIds,
          profile.identity,
          profile.chat_password,
          (newSocket) => {
            chatSocket = newSocket; // Update the reference
            setSocket(newSocket);
          },
        );
      }, 1000);
    }
  }, [dispatch, profile]);

  useEffect(() => {
    const hasUnreadMessage = chatRooms.some((room) => room.unreads);
    dispatch(updateIndicatorList({hasUnreadMessage}));
  }, [dispatch, chatRooms]);

  useEffect(() => {
    const hasTransfer = transfers.some(
      (item) =>
        item.to_therapist_id === profile.id &&
        item.status === TRANSFER_STATUS.INVITED,
    );
    dispatch(updateIndicatorList({hasTransfer}));
  }, [dispatch, profile.id, transfers]);

  useEffect(() => {
    if (callAccessToken) {return}

    if (isOnline && chatSocket && chatAuth?.userId && chatAuth?.token) {
      getLocalData(STORAGE_KEY.ACCEPTED_CALL).then(async (acceptedCall) => {
        if (JSON.parse(acceptedCall)) {
          await storeLocalData(STORAGE_KEY.ACCEPTED_CALL, 'false');

          dispatch(acceptedRequest(true));
        }
      });

      if (accessToken) {
        dispatch(acceptCallHandler(chatSocket));
      }
    }
  }, [accessToken, callAccessToken, chatAuth, dispatch, isOnline]);

  useEffect(() => {
    if (isOnline && isDataUpToDate === false) {
      store.dispatch(forceLogout());
      Alert.alert(translate('user.session'), translate('user.session_expired'));
    }
  }, [isOnline, isDataUpToDate, translate]);

  useEffect(() => {
    if (isOnline && accessToken) {
      dispatch(syncPatientOffline());
    }
  }, [isOnline, dispatch, accessToken]);

  useEffect(() => {
    if (isOnline && accessToken && offlineQuestionnaireAnswers.length) {
      dispatch(completeQuestionnaire(offlineQuestionnaireAnswers));
    }
  }, [dispatch, accessToken, isOnline, offlineQuestionnaireAnswers]);

  useEffect(() => {
    if (isOnline && accessToken && offlineActivities.length) {
      dispatch(completeActive(offlineActivities));
    }
  }, [dispatch, accessToken, isOnline, offlineActivities]);

  useEffect(() => {
    if (isOnline && accessToken && offlineGoals.length) {
      dispatch(completeGoal(offlineGoals));
    }
  }, [dispatch, accessToken, isOnline, offlineGoals]);

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
