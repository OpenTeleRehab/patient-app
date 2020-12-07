/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';

class Home extends React.Component {
  handleOpenDrawer = () => {
    this.props.navigation.toggleDrawer();
  };

  render() {
    return (
      <>
        <HeaderBar
          rightContent={{
            icon: 'setting',
            iconType: 'antdesign',
            iconSize: 28,
            label: '',
            onPress: () => this.handleOpenDrawer(),
          }}
          navigation={this.props.navigation}
        />
        <ScrollView style={styles.mainContainerPrimary}>
          <View style={styles.flexCenter}>
            <Text style={styles.textLightBold}>Hi, Luke!</Text>
            <Text h4 style={styles.textLight}>
              No activity for today.
            </Text>
          </View>
        </ScrollView>
      </>
    );
  }
}

export default Home;
