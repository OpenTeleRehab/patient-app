/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
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
import JitsiMeet from '@webessentials/react-native-jitsi-meet';
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
import {getPartnerLogoRequest} from './src/store/partnerLogo/actions';
import store from './src/store';
import {forceLogout} from './src/store/auth/actions';
import {
  completeActive,
  completeGoal,
  completeQuestionnaire,
} from './src/store/activity/actions';
import {updateIndicatorList} from './src/store/indicator/actions';
import messaging from '@react-native-firebase/messaging';
import {getPhoneRequest} from './src/store/phone/actions';

let chatSocket = null;
let isAnswerCall = false;

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
  const {
    accessToken,
    firebaseToken,
    profile,
    isDataUpToDate,
    phone,
  } = useSelector((state) => state.user);
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
  const isOnline = useNetInfo().isConnected;
  const [socket, setSocket] = useState(null);

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.AUTH_INFO, true);
    if (data) {
      setTimespan(data.timespan);
    }

    const lang = await getLocalData(STORAGE_KEY.LANGUAGE);
    setLanguage(lang);

    await messaging().requestPermission();
  }, []);

  const answerCall = async () => {
    const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);
    if (!_.isEmpty(callInfo)) {
      if (Platform.OS === 'android') {
        RNCallKeep.backToForeground();
      }
      isAnswerCall = true;

      const message = {
        _id: callInfo._id,
        rid: callInfo.rid,
        msg: CALL_STATUS.ACCEPTED,
      };
      updateMessage(chatSocket, message, profile.id);

      RNCallKeep.endCall(callInfo.callUUID);
    }
  };

  const endCall = async () => {
    const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);
    if (!_.isEmpty(callInfo) && !_.isEmpty(profile) && !isAnswerCall) {
      const message = {
        _id: callInfo._id,
        rid: callInfo.rid,
        msg: callInfo.body.includes('audio')
          ? CALL_STATUS.AUDIO_MISSED
          : CALL_STATUS.VIDEO_MISSED,
      };

      updateMessage(chatSocket, message, profile.id);

      RNCallKeep.endCall(callInfo.callUUID);
      await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);
    }
  };

  useEffect(() => {
    const options = {
      ios: {
        appName: 'PatientApp',
        imageName: 'sim_icon',
        supportsVideo: true,
        maximumCallGroups: '1',
        maximumCallsPerCallGroup: '1',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
        additionalPermissions: [],
      },
    };

    RNCallKeep.setup(options);
  }, []);

  useEffect(() => {
    RNCallKeep.addEventListener('answerCall', answerCall);
    RNCallKeep.addEventListener('endCall', endCall);

    return () => {
      RNCallKeep.removeEventListener('answerCall', answerCall);
      RNCallKeep.removeEventListener('endCall', endCall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(updateIndicatorList({isOnlineMode: isOnline}));
  }, [dispatch, isOnline]);

  useEffect(() => {
    dispatch(getPartnerLogoRequest());
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
    if (loading && language !== undefined) {
      dispatch(getTranslations(language)).then((res) => {
        // If it is fresh installed and not connection
        if (!res && messages.local) {
          Alert.alert(
            messages['error.connection.alert_title'],
            messages['error.connection.alert_content'],
          );
        } else {
          // Delay of the splash screen so that partner logo is visible
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        }
      });
    }
  }, [loading, language, messages, dispatch]);

  useEffect(() => {
    if (
      isOnline &&
      profile.identity &&
      profile.chat_password &&
      chatSocket === null
    ) {
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
    }
  }, [dispatch, isOnline, profile]);

  useEffect(() => {
    if (chatAuth !== undefined) {
      dispatch(getChatRooms());
      JitsiMeet.endCall();
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
      if (socket === null) {
        dispatch(getPhoneRequest({phone: phone})).then(() => {
          setSocket(new WebSocket(store.getState().phone.chatWebsocketURL));
        });
      } else {
        socket.onopen = () => {
          if (
            isOnline &&
            profile &&
            socket &&
            !!socket.readyState &&
            profile.id
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
        };
      }
    }
  }, [profile, isOnline, dispatch, socket, phone]);

  useEffect(() => {
    if (
      chatSocket !== null &&
      chatSocket.readyState === chatSocket.OPEN &&
      profile.id &&
      selectedRoom
    ) {
      chatRooms.forEach((item) => {
        loadHistoryInRoom(chatSocket, item.rid, profile.id);
      });
    }
  }, [selectedRoom, profile, chatRooms]);

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
    if (accessToken && (firebaseToken === undefined || firebaseToken === '')) {
      messaging()
        .getToken()
        .then((fcmToken) => {
          if (fcmToken && fcmToken !== firebaseToken) {
            dispatch(createFirebaseToken(accessToken, fcmToken));
          }
        });
    }
  }, [dispatch, accessToken, firebaseToken]);

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
