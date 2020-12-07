/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';

import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';

class Appointment extends React.Component {
  render() {
    return (
      <>
        <HeaderBar
          title="Appointments"
          rightContent={{label: 'Request appointment', onPress: () => null}}
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
  }
}

export default Appointment;
