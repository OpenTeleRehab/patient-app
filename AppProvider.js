/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {Platform, AppState} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from './src/components/SplashScreen';
import {getTranslations} from './src/store/translation/actions';
import {
  createFirebaseToken,
  setInitialRouteName,
} from './src/store/user/actions';
import {CALL_STATUS, ROUTES, STORAGE_KEY} from './src/variables/constants';
import {getLocalData, storeLocalData} from './src/utils/local_storage';
import moment from 'moment';
import settings from './config/settings';
import RocketchatContext from './src/context/RocketchatContext';
import {
  initialChatSocket,
  loadHistoryInRoom,
  sendNewMessage,
  updateMessage,
} from './src/utils/rocketchat';
import {getUniqueId} from './src/utils/helper';
import {
  clearOfflineMessages,
  clearSecondaryVideoCallStatus,
  clearVideoCallStatus,
  getChatRooms,
  postAttachmentMessage,
  setChatSubscribeIds,
} from './src/store/rocketchat/actions';
import {addTranslationForLanguage, getTranslate} from 'react-localize-redux';
import RNCallKeep from '@webessentials/react-native-callkeep';
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
import messaging from '@react-native-firebase/messaging';
import {callPermission, notificationPermission} from './src/utils/permission';

let chatSocket = null;
let patientId = null;
let isAnswerCall = false;

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const {accessToken, profile, isDataUpToDate} = useSelector(
    (state) => state.user,
  );
  const {messages} = useSelector((state) => state.translation);
  const {
    messages: chatMessages,
    chatAuth,
    chatRooms,
    selectedRoom,
    offlineMessages,
  } = useSelector((state) => state.rocketchat);
  const localize = useSelector((state) => state.localize);
  const {
    offlineQuestionnaireAnswers,
    offlineActivities,
    offlineGoals,
  } = useSelector((state) => state.activity);
  const translate = getTranslate(localize);
  const [loading, setLoading] = useState(true);
  const [timespan, setTimespan] = useState('');
  const [language, setLanguage] = useState(undefined);
  const [socket, setSocket] = useState(null);
  const isOnline = useNetInfo().isConnected;

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.AUTH_INFO, true);
    const lang = await getLocalData(STORAGE_KEY.LANGUAGE);

    if (data) {
      setTimespan(data.timespan);
    }

    setLanguage(lang);
  }, []);

  const answerCall = async () => {
    const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);

    if (!_.isEmpty(callInfo) && patientId) {
      isAnswerCall = true;

      if (Platform.OS === 'android') {
        RNCallKeep.backToForeground();

        const message = {
          _id: callInfo._id,
          rid: callInfo.rid,
          msg: CALL_STATUS.ACCEPTED,
        };
        updateMessage(chatSocket, message, patientId);
      }

      RNCallKeep.endCall(callInfo.callUUID);
    }
  };

  const endCall = async () => {
    const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);

    if (!_.isEmpty(callInfo) && patientId && !isAnswerCall) {
      const message = {
        _id: callInfo._id,
        rid: callInfo.rid,
        msg: callInfo.body.includes('audio')
          ? CALL_STATUS.AUDIO_MISSED
          : CALL_STATUS.VIDEO_MISSED,
      };

      updateMessage(chatSocket, message, patientId);

      RNCallKeep.endCall(callInfo.callUUID);

      // Clean call info local data
      await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);
    }

    isAnswerCall = false;
  };

  useEffect(() => {
    // Listen AppState change
    AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    // Request notification permission
    notificationPermission();
  }, []);

  useEffect(() => {
    RNCallKeep.addEventListener('answerCall', answerCall);
    RNCallKeep.addEventListener('endCall', endCall);

    return () => {
      RNCallKeep.removeEventListener('answerCall', answerCall);
      RNCallKeep.removeEventListener('endCall', endCall);
    };
  }, []);

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
    if (loading) {
      dispatch(getTranslations(language)).then(() => {
        setLoading(false);
      });
    }
  }, [dispatch, loading, language]);

  useEffect(() => {
    if (isOnline && profile.identity && profile.chat_password) {
      if (Platform.OS === 'ios' && appStateVisible === 'active') {
        const subscribeIds = {
          loginId: getUniqueId(profile.id),
          roomMessageId: getUniqueId(profile.id),
          notifyLoggedId: getUniqueId(profile.id),
        };

        dispatch(setChatSubscribeIds(subscribeIds));

        chatSocket = initialChatSocket(
          dispatch,
          subscribeIds,
          profile.identity,
          profile.chat_password,
        );

        setSocket(chatSocket);

        // Request phone calls permission
        callPermission();
      }

      if (Platform.OS === 'android' && chatSocket === null) {
        const subscribeIds = {
          loginId: getUniqueId(profile.id),
          roomMessageId: getUniqueId(profile.id),
          notifyLoggedId: getUniqueId(profile.id),
        };

        dispatch(clearVideoCallStatus());
        dispatch(clearSecondaryVideoCallStatus());
        dispatch(setChatSubscribeIds(subscribeIds));

        chatSocket = initialChatSocket(
          dispatch,
          subscribeIds,
          profile.identity,
          profile.chat_password,
        );

        // Request phone calls permission
        callPermission();
      }
    }
  }, [dispatch, isOnline, profile, appStateVisible]);

  useEffect(() => {
    if (chatAuth !== undefined) {
      dispatch(getChatRooms());
    }
  }, [dispatch, chatAuth]);

  useEffect(() => {
    if (
      isOnline &&
      chatSocket !== null &&
      chatSocket.readyState === chatSocket.OPEN &&
      selectedRoom
    ) {
      if (offlineMessages.length) {
        offlineMessages.map((item) => {
          item.attachment !== undefined
            ? dispatch(postAttachmentMessage(item.rid, item.attachment))
            : sendNewMessage(chatSocket, item, profile.id);
        });
        dispatch(clearOfflineMessages());
      }
    }
  }, [
    dispatch,
    isOnline,
    chatMessages,
    profile,
    selectedRoom,
    offlineMessages,
  ]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (
        isOnline &&
        profile &&
        profile.id &&
        chatSocket &&
        chatSocket.readyState === chatSocket.OPEN
      ) {
        getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
          getLocalData(STORAGE_KEY.REJECTED_CALL, false).then(
            (rejectedCall) => {
              if (rejectedCall === 'true') {
                const message = {
                  _id: callInfo._id,
                  rid: callInfo.rid,
                  msg: callInfo.body.includes('audio')
                    ? CALL_STATUS.AUDIO_MISSED
                    : CALL_STATUS.VIDEO_MISSED,
                };

                updateMessage(chatSocket, message, profile.id);

                RNCallKeep.endCall(callInfo.callUUID);
              } else {
                if (!_.isEmpty(callInfo)) {
                  const message = {
                    _id: callInfo._id,
                    rid: callInfo.rid,
                    msg: CALL_STATUS.ACCEPTED,
                  };

                  isAnswerCall = true;

                  updateMessage(chatSocket, message, profile.id);
                }
              }
            },
          );
        });
      }
    }

    if (Platform.OS === 'ios') {
      if (
        isOnline &&
        isAnswerCall &&
        accessToken &&
        profile &&
        profile.id &&
        socket
      ) {
        getLocalData(STORAGE_KEY.CALL_INFO, true).then((res) => {
          if (!_.isEmpty(res)) {
            setTimeout(() => {
              const message = {
                _id: res._id,
                rid: res.rid,
                msg: CALL_STATUS.ACCEPTED,
              };

              updateMessage(socket, message, profile.id);
            }, 1000);
          }
        });
      }
    }
  }, [dispatch, profile, isOnline, socket, accessToken]);

  useEffect(() => {
    if (
      accessToken &&
      chatSocket !== null &&
      chatSocket.readyState === chatSocket.OPEN &&
      profile.id &&
      selectedRoom
    ) {
      chatRooms.forEach((item) => {
        loadHistoryInRoom(chatSocket, item.rid, profile.id);
      });
    }
  }, [accessToken, selectedRoom, profile, chatRooms]);

  useEffect(() => {
    if (isOnline && isDataUpToDate === false) {
      store.dispatch(forceLogout());
      Alert.alert(translate('user.session'), translate('user.session_expired'));
    }
  }, [isOnline, isDataUpToDate, translate]);

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

  useEffect(() => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        dispatch(createFirebaseToken(accessToken, fcmToken));
      });
  }, [dispatch, accessToken]);

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
