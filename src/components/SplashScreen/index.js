/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {View, Image, StyleSheet, ActivityIndicator} from 'react-native';

import logoWhite from '../../assets/images/logo-white.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0077C8',
  },
  logo: {
    width: 250,
    height: 107,
  },
  loading: {
    marginTop: 50,
  },
});

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={logoWhite} style={styles.logo} />
      <ActivityIndicator size={60} color="#06038D" style={styles.loading} />
    </View>
  );
};

export default SplashScreen;
