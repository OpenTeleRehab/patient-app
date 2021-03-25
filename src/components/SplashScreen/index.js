/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Image, ActivityIndicator} from 'react-native';
import styles from '../../assets/styles';
import {Text} from 'react-native-elements';

import logoWhite from '../../assets/images/logo-white.png';
import partnerLogos from '../../assets/images/partner-logos.png';
import settings from '../../../config/settings';
import hiLogo from '../../assets/images/hi-logo.png';
import {getLocalData} from '../../utils/local_storage';
import {STORAGE_KEY} from '../../variables/constants';

const SplashScreen = () => {
  const [translate, setTranslate] = useState(null);

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.TRANSLATE, true);
    if (data) {
      setTranslate(data);
    }
  }, []);

  useEffect(() => {
    fetchLocalData();
  }, [fetchLocalData]);

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
            <Text style={[styles.fontWeightBold, styles.textWhite]}>
              {translate ? translate.powered_by : 'Powered by'}
            </Text>
            <Image source={hiLogo} style={styles.splashScreenPoweredByLogo} />
          </View>
          <Text style={[styles.textWhite]}>{settings.appVersion}</Text>
        </View>
      </View>
      <View style={styles.splashScreenSponsorsContainer}>
        <Text style={[styles.fontWeightBold, styles.textPrimary]}>
          {translate ? translate.supported_by : 'Supported by'}
        </Text>
        <Image style={styles.splashScreenSponsorLogos} source={partnerLogos} />
      </View>
    </View>
  );
};

export default SplashScreen;
