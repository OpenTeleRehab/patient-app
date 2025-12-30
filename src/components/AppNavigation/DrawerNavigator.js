/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useContext, useState} from 'react';
import {Switch, Text, View} from 'react-native';
import styles from '../../assets/styles';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import FIcon from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {enableKidTheme, logoutRequest} from '../../store/user/actions';
import {chatLogout, unSubscribeEvent} from '../../utils/rocketchat';
import RocketchatContext from '../../context/RocketchatContext';

const iconRenderer = (route, size, color) => (
  <FIcon name={route.icon} color={color} size={size} />
);

const DrawerNavigator = ({
  allowSwitchTheme = true,
  drawerItems = [],
  navProps,
}) => {
  const dispatch = useDispatch();
  const {navigation} = navProps;
  const chatSocket = useContext(RocketchatContext);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {subscribeIds, chatAuth} = useSelector((state) => state.rocketchat);
  const {accessToken, profile} = useSelector((state) => state.user);
  const [isKidTheme, setIsKidTheme] = useState(profile.kid_theme !== 0);

  const handleKidThemeChange = (value) => {
    setIsKidTheme(value);
    dispatch(enableKidTheme(accessToken, value));
  };

  const handleNavigate = (route) => {
    navigation.closeDrawer();
    navigation.navigate(route.name);
  };

  const handleLogout = () => {
    unSubscribeEvent(chatSocket, subscribeIds.loginId);
    chatLogout(chatSocket, chatAuth.userId);

    dispatch(logoutRequest(accessToken));
  };

  return (
    <View style={styles.navDrawerContainer}>
      <DrawerContentScrollView {...navProps}>
        {allowSwitchTheme && (
          <View
            style={[
              styles.navKidThemeWrapper,
              styles.flexRow,
              styles.flexCenter,
              styles.justifyContentSpaceAround,
            ]}>
            <Text style={styles.width70}>{translate('common.theme.kid')}</Text>
            <Switch
              trackColor={{false: '#767577', true: '#0077C8'}}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#767577"
              onValueChange={(value) => handleKidThemeChange(value)}
              value={isKidTheme}
            />
          </View>
        )}
        {drawerItems.map((route, index) => (
          <DrawerItem
            key={index}
            focused={navProps.state.routeNames[navProps.state.index] === route.name}
            label={translate(route.label)}
            labelStyle={styles.textDefault}
            onPress={() => handleNavigate(route)}
            icon={({size, color}) => iconRenderer(route, size, color)}
          />
        ))}
      </DrawerContentScrollView>
      <View style={styles.navDrawerBottomContainer}>
        <Button
          containerStyle={styles.navDrawerBottom}
          title={translate('common.logout')}
          onPress={() => handleLogout()}
        />
        <Button
          type="outline"
          containerStyle={styles.navDrawerBottom}
          title={translate('common.back')}
          onPress={() => navigation.closeDrawer()}
          buttonStyle={styles.navDrawerBackBottom}
        />
      </View>
    </View>
  );
};

export default DrawerNavigator;
