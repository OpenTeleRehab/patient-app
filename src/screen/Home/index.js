/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {useSelector} from 'react-redux';

const Home = ({navigation}) => {
  const profile = useSelector((state) => state.user.profile);

  return (
    <>
      <HeaderBar
        leftContent={{hasLogo: true}}
        rightContent={{
          icon: 'setting',
          iconType: 'antdesign',
          iconSize: 28,
          label: '',
          onPress: () => navigation.toggleDrawer(),
        }}
      />
      <ScrollView style={styles.mainContainerPrimary}>
        <View style={styles.flexCenter}>
          <Text style={styles.textLightBold}>Hi, {profile.first_name}!</Text>
          <Text h4 style={styles.textLight}>
            No activity for today.
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Home;
