/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import styles from '../../assets/styles';
import HeaderBar from '../../components/Common/HeaderBar';

const Message = ({navigation}) => {
  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title="Dr. Magaret Huge"
      />
      <View style={styles.mainContainerLight}>
        <View style={styles.flexCenter}>
          <Text h4>Message Screen</Text>
        </View>
      </View>
    </>
  );
};

export default Message;
