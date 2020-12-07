/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';

import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';

class Activity extends React.Component {
  render() {
    return (
      <>
        <HeaderBar
          rightContent={{
            icon: 'arrow-collapse-down',
            iconType: 'material-community',
            label: 'Download',
            onPress: () => null,
          }}
          title="Activities"
        />
        <ScrollView style={styles.mainContainerPrimary}>
          <View style={styles.flexCenter}>
            <Text h4 style={styles.textLight}>
              Activity Screen
            </Text>
          </View>
        </ScrollView>
      </>
    );
  }
}

export default Activity;
