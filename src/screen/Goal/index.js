/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';

import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';

class Goal extends React.Component {
  render() {
    return (
      <>
        <HeaderBar
          light
          title="Goals"
          rightContent={{label: 'Close', onPress: () => null}}
        />
        <ScrollView style={styles.mainContainerLight}>
          <View style={styles.flexCenter}>
            <Text h4>Goal Screen</Text>
          </View>
        </ScrollView>
      </>
    );
  }
}

export default Goal;
