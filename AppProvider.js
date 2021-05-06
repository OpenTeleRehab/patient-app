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
import {initialChatSocket, loadHistoryInRoom} from './src/utils/rocketchat';
import {getUniqueId} from './src/utils/helper';
import JitsiMeet from '@webessentials/react-native-jitsi-meet';
import {
  clearChatData,
  getChatRooms,
  getChatUsersStatus,
  getLastMessages,
  setChatSubscribeIds,
} from './src/store/rocketchat/actions';
import {addTranslationForLanguage} from 'react-localize-redux';

let chatSocket = null;

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
  const {accessToken, profile} = useSelector((state) => state.user);
  const {messages} = useSelector((state) => state.translation);
  const {chatAuth, chatRooms, selectedRoom} = useSelector(
    (state) => state.rocketchat,
  );
  const [loading, setLoading] = useState(true);
  const [timespan, setTimespan] = useState('');
  const [language, setLanguage] = useState(undefined);

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.AUTH_INFO, true);
    if (data) {
      setTimespan(data.timespan);
    }

    const lang = await getLocalData(STORAGE_KEY.LANGUAGE);
    setLanguage(lang);
  }, []);

  useEffect(() => {
    fetchLocalData();
  }, [fetchLocalData]);

  useEffect(() => {
    dispatch(clearChatData());
    if (timespan) {
      if (moment().diff(moment(timespan, settings.format.date), 'days') > 0) {
        dispatch(setInitialRouteName(ROUTES.REGISTER));
      } else {
        dispatch(setInitialRouteName(ROUTES.LOGIN));
      }
    }
  }, [timespan, dispatch]);

  useEffect(() => {
    if (loading && language !== undefined) {
      dispatch(getTranslations(language)).then((res) => {
        if (res) {
          setLoading(false);
        } else if (messages) {
          dispatch(addTranslationForLanguage(messages, 'en'));
          setLoading(false);
        }
      });
    }
  }, [loading, language, messages, dispatch]);

  useEffect(() => {
    if (!loading && accessToken && profile.chat_user_id && profile.chat_rooms) {
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
    }
  }, [dispatch, loading, accessToken, profile]);

  useEffect(() => {
    if (chatAuth !== undefined) {
      dispatch(getChatRooms());
      JitsiMeet.endCall();
    }
  }, [dispatch, chatAuth]);

  useEffect(() => {
    if (chatAuth !== undefined && chatRooms.length) {
      const activeRoomIds = [];
      chatRooms.forEach((cr) => {
        if (cr.enabled) {
          activeRoomIds.push(cr.rid);
        }
      });
      if (activeRoomIds.length) {
        dispatch(getChatUsersStatus());
        dispatch(getLastMessages(activeRoomIds));
      }
    }
  }, [dispatch, chatRooms, chatAuth]);

  useEffect(() => {
    if (
      chatSocket !== null &&
      chatSocket.readyState === chatSocket.OPEN &&
      profile.id &&
      selectedRoom
    ) {
      loadHistoryInRoom(chatSocket, selectedRoom.rid, profile.id);
    }
  }, [selectedRoom, profile]);

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
