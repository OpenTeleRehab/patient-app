/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {View, Image, StyleSheet, ActivityIndicator} from 'react-native';
import {withTheme} from 'react-native-elements';

import logoWhite from '../../assets/images/logo-white.png';

const styles = StyleSheet.create({
  container: (theme) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  }),
  logo: {
    width: 250,
    height: 107,
  },
  loading: {
    marginTop: 50,
  },
});

const SplashScreen = (props) => {
  const {theme} = props;
  return (
    <View style={styles.container(theme)}>
      <Image source={logoWhite} style={styles.logo} />
      <ActivityIndicator
        size={60}
        color={theme.colors.blueDark}
        style={styles.loading}
      />
    </View>
  );
};

export default withTheme(SplashScreen);
