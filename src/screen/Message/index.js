/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text, Header} from 'react-native-elements';

import styles from '../../assets/styles';

class Message extends React.Component {
  render() {
    return (
      <>
        <Header
          backgroundColor="white"
          leftComponent={{text: 'Back'}}
          centerComponent={{text: 'Dr. Magaret Huge'}}
        />
        <ScrollView style={styles.mainContainerLight}>
          <View style={styles.flexCenter}>
            <Text h4>Message Screen</Text>
          </View>
        </ScrollView>
      </>
    );
  }
}

export default Message;
