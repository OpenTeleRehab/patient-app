/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {View, Image, ActivityIndicator} from 'react-native';
import styles from '../../assets/styles';
import {Text} from 'react-native-elements';

import logoWhite from '../../assets/images/logo-white.png';
import settings from '../../../config/settings';
import hiLogo from '../../assets/images/hi-logo.png';
import {useSelector} from 'react-redux';
import {Translate} from 'react-localize-redux';

const SplashScreen = () => {
  const {partnerLogo} = useSelector((state) => state.partnerLogo);
  const {adminApiBaseURL} = useSelector((state) => state.phone);

  return (
    <View style={styles.flexColumn}>
      <View style={styles.flexColumn}>
        <View style={styles.splashScreenContainer}>
          <Image source={logoWhite} style={styles.splashScreenLogo} />
          <ActivityIndicator
            size={60}
            color="#06038D"
            style={styles.splashScreenLoading}
          />
        </View>
        <View style={styles.splashScreenPoweredByContainer}>
          <View style={styles.splashScreenPoweredByWrapper}>
            <Text style={[styles.fontBold, styles.textLight]}>
              <Translate id="common.powered_by" />
            </Text>
            <Image source={hiLogo} style={styles.splashScreenPoweredByLogo} />
          </View>
          <Text style={[styles.fontBase, styles.textLight]}>
            {settings.appVersion}
          </Text>
        </View>
      </View>
      {partnerLogo && (
        <View style={styles.splashScreenSponsorsContainer}>
          <Text style={[styles.fontBold, styles.textPrimary]}>
            <Translate id="common.supported_by" />
          </Text>
          <Image
            style={styles.splashScreenSponsorLogos}
            source={{
              uri: adminApiBaseURL + '/file/' + partnerLogo.id,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default SplashScreen;
