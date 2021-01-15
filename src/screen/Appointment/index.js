/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';

const Appointment = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  return (
    <>
      <HeaderBar
        leftContent={{label: translate('tab.appointments')}}
        rightContent={{
          label: translate('request.appointments'),
          onPress: () => null,
        }}
      />
      <ScrollView style={styles.mainContainerPrimary}>
        <View style={styles.flexCenter}>
          <Text h4 style={styles.textLight}>
            Appointment Screen
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Appointment;
