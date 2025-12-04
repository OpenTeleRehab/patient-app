/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, Text} from 'react-native';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';

const Patient = ({navigation}) => {
  return (
    <>
      <HeaderBar
        backgroundPrimary={true}
        setting={{
          hasSetting: true,
          onGoSetting: () => navigation.toggleDrawer(),
        }}
        leftContent={{hasLogo: true}}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLight}>
        <Text>Patient Screen</Text>
      </ScrollView>
    </>
  );
};

export default Patient;
