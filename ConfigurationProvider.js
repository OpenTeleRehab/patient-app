/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import SplashScreen from './src/components/SplashScreen';
import {loadIndicatorList} from './src/store/indicator/actions';

const ConfigurationProvider = ({children}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // TODO
  useEffect(() => {
    if (loading) {
      dispatch(loadIndicatorList());
      setLoading(false);
    }
  }, [loading, dispatch]);

  return loading ? <SplashScreen /> : children;
};

ConfigurationProvider.propTypes = {
  children: PropTypes.node,
};

export default ConfigurationProvider;
