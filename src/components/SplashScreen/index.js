/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {View, Image, ActivityIndicator} from 'react-native';
import styles from '../../assets/styles';

import logoWhite from '../../assets/images/logo-white.png';
import hiLogo from '../../assets/images/hi-logo.png';

const SplashScreen = () => {
  return (
    <View style={[styles.flexColumn, styles.mainContainerPrimary]}>
      <View style={[styles.flexCenter, styles.justifyContentCenter]}>
        <Image source={logoWhite} style={styles.splashScreenLogo} />
        <ActivityIndicator size={60} color="#06038D" />
      </View>
      <View style={styles.splashScreenPoweredByContainer}>
        <Image source={hiLogo} style={styles.splashScreenPoweredByLogo} />
      </View>
    </View>
  );
};

export default SplashScreen;
