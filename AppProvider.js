/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState} from 'react';
import BackgroundTimer from 'react-native-background-timer';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {mutation} from './src/store/rocketchat/mutations';
import SplashScreen from './src/components/SplashScreen';
import {getTranslations} from './src/store/translation/actions';
import {setInitialRouteName} from './src/store/user/actions';
import {CALL_STATUS, ROUTES, STORAGE_KEY, TRANSFER_STATUS} from './src/variables/constants';
import {getLocalData, storeLocalData} from './src/utils/local_storage';
import moment from 'moment';
import settings from './config/settings';
import RocketchatContext from './src/context/RocketchatContext';
import {initialChatSocket} from './src/utils/rocketchat';
import {getUniqueId} from './src/utils/helper';
import {
  acceptRejectHandler,
  setChatSubscribeIds,
  updateTextMessage,
} from './src/store/rocketchat/actions';
import {addTranslationForLanguage, getTranslate} from 'react-localize-redux';
import RNCallKeep from 'react-native-callkeep';
import {Alert} from 'react-native';
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
import {useAppointmentNotifications} from './src/hook/useAppointmentNotifications';
import _ from 'lodash';

let chatSocket = null;
let patientId = null;

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
  const {accessToken, profile, isDataUpToDate} = useSelector(
    (state) => state.user,
  );
  const {messages} = useSelector((state) => state.translation);
  const {chatRooms} = useSelector((state) => state.rocketchat);
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

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.AUTH_INFO, true);
    const lang = await getLocalData(STORAGE_KEY.LANGUAGE);

    if (data) {
      setTimespan(data.timespan);
    }

    setLanguage(lang || 1);
  }, []);

  const answerCall = useCallback(async () => {
    dispatch(mutation.hasAcceptedCall(true));
    dispatch(mutation.showIncomingCall(false));

    const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);

    if (!_.isEmpty(callInfo) && patientId) {
      const intervalID = setInterval(() => {
        if (chatSocket && chatSocket.readyState === chatSocket.OPEN) {
          const message = {
            _id: callInfo._id,
            rid: callInfo.rid,
            user: {
              _id: profile.chat_user_id,
              username: profile.identity,
            },
            text: CALL_STATUS.ACCEPTED,
          };

          dispatch(updateTextMessage(chatSocket, message));

          clearInterval(intervalID);
        }
      }, 1000);
    }
  }, [dispatch, profile.chat_user_id, profile.identity]);

  const endCall = useCallback(async () => {
    const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);
    const rejectedCall = await getLocalData(STORAGE_KEY.REJECTED_CALL);

    if (!_.isEmpty(callInfo) && patientId && rejectedCall === 'true') {
      const message = {
        _id: callInfo._id,
        rid: callInfo.rid,
        user: {
          _id: profile.chat_user_id,
          username: profile.identity,
        },
        text: callInfo.body.includes('audio')
          ? CALL_STATUS.AUDIO_MISSED
          : CALL_STATUS.VIDEO_MISSED,
      };

      if (chatSocket && chatSocket.readyState === chatSocket.OPEN) {
        dispatch(updateTextMessage(chatSocket, message));

        BackgroundTimer.setTimeout(async () => {
          await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);
        }, 1000);
      } else {
        const intervalID = setInterval(async () => {
          if (chatSocket && chatSocket.readyState === chatSocket.OPEN) {
            dispatch(updateTextMessage(chatSocket, message));

            BackgroundTimer.setTimeout(async () => {
              await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);
            }, 1000);

            clearInterval(intervalID);
          }
        }, 1000);
      }
    }
  }, [dispatch, profile]);

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
    if (!_.isEmpty(profile)) {
      patientId = profile.id;
    }
  }, [profile]);

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
    if (profile.identity && profile.chat_password) {
      const subscribeIds = {
        loginId: getUniqueId(profile.id),
        roomMessageId: getUniqueId(profile.id),
        notifyLoggedId: getUniqueId(profile.id),
      };

      // Set chat subscribe ids
      dispatch(setChatSubscribeIds(subscribeIds));

      // Initial chat socket
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
    }
  }, [dispatch, profile.chat_password, profile.id, profile.identity]);

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
    if (isOnline && socket) {
      const intervalID = setInterval(() => {
        if (socket.readyState === socket.OPEN) {
          dispatch(acceptRejectHandler(socket));

          clearInterval(intervalID);
        }
      }, 1000);
    }
  }, [accessToken, dispatch, isOnline, socket]);

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
