/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import SplashScreen from './src/components/SplashScreen';
import {getTranslations} from './src/store/translation/actions';

const AppProvider = ({children}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

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
