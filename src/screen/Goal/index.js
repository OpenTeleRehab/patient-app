/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';

const Goal = () => {
  return (
    <>
      <HeaderBar
        leftContent={{label: 'Goals'}}
        rightContent={{label: 'Close', onPress: () => null}}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.flexCenter}>
          <Text h4>Goal Screen</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Goal;
