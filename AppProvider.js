/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from './src/components/SplashScreen';
import {getTranslations} from './src/store/translation/actions';
import {setInitialRouteName} from './src/store/user/actions';
import {ROUTES, STORAGE_KEY} from './src/variables/constants';
import {getLocalData} from './src/utils/local_storage';
import moment from 'moment';
import settings from './config/settings';
import RocketchatContext from './src/context/RocketchatContext';
import {
  initialChatSocket,
  loadHistoryInRoom,
  sendNewMessage,
} from './src/utils/rocketchat';
import {getUniqueId} from './src/utils/helper';
import JitsiMeet from '@webessentials/react-native-jitsi-meet';
import {
  getChatRooms,
  setChatSubscribeIds,
  postAttachmentMessage,
  clearOfflineMessages,
  clearVideoCallStatus,
  clearSecondaryVideoCallStatus,
} from './src/store/rocketchat/actions';
import {addTranslationForLanguage, getTranslate} from 'react-localize-redux';
import {getPartnerLogoRequest} from './src/store/partnerLogo/actions';
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

let chatSocket = null;

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
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
  const isOnline = useNetInfo().isConnected;

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.AUTH_INFO, true);
    if (data) {
      setTimespan(data.timespan);
    }

    const lang = await getLocalData(STORAGE_KEY.LANGUAGE);
    setLanguage(lang);
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
      !loading &&
      accessToken &&
      profile.chat_user_id &&
      profile.chat_rooms
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
  }, [isOnline, dispatch, loading, accessToken, profile]);

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
