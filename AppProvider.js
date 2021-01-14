/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import SplashScreen from './src/components/SplashScreen';
import {getTranslations} from './src/store/translation/actions';
import {setInitialRouteName} from './src/store/user/actions';
import {ROUTES, STORAGE_KEY} from './src/variables/constants';
import {getLocalData} from './src/utils/local_storage';
import moment from 'moment';
import settings from './config/settings';

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [timespan, setTimespan] = useState('');

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.AUTH_INFO, true);
    if (data) {
      setTimespan(data.timespan);
    }
  }, []);

  useEffect(() => {
    fetchLocalData();
  }, [fetchLocalData]);

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
    if (loading) {
      dispatch(getTranslations()).then((res) => {
        if (res) {
          setLoading(false);
        }
      });
    }
  }, [loading, dispatch]);

  return loading ? <SplashScreen /> : children;
};

AppProvider.propTypes = {
  children: PropTypes.node,
};

export default AppProvider;
