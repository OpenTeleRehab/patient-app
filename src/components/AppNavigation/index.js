/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Image, PermissionsAndroid, Platform} from 'react-native';
import {withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import HomeTab from './Tab/HomeTab';
import ActivityTab from './Tab/ActivityTab';
import AppointmentTab from './Tab/AppointmentTab';
import MessageTab from './Tab/MessageTab';
import {ROUTES} from '../../variables/constants';
import {auths} from '../../variables/routes';
import styles from '../../assets/styles';

import homeIcon from '../../assets/images/home-icon.png';
import homeActiveIcon from '../../assets/images/home-active-icon.png';
import activityIcon from '../../assets/images/activity-icon.png';
import activityActiveIcon from '../../assets/images/activity-active-icon.png';
import appointmentIcon from '../../assets/images/appointment-icon.png';
import appointmentActiveIcon from '../../assets/images/appointment-active-icon.png';
import messageIcon from '../../assets/images/message-icon.png';
import messageActiveIcon from '../../assets/images/message-active-icon.png';

const AuthStack = createStackNavigator();
const AppTab = createBottomTabNavigator();

const tabs = [
  {
    name: ROUTES.HOME,
    screen: HomeTab,
    label: 'tab.home',
    icon: homeIcon,
    activeIcon: homeActiveIcon,
    badge: 'noBadge',
  },
  {
    name: ROUTES.ACTIVITY,
    screen: ActivityTab,
    label: 'tab.activities',
    icon: activityIcon,
    activeIcon: activityActiveIcon,
    badge: 'hasActivity',
  },
  {
    name: ROUTES.APPOINTMENT,
    screen: AppointmentTab,
    label: 'tab.appointments',
    icon: appointmentIcon,
    activeIcon: appointmentActiveIcon,
    badge: 'hasAppointment',
  },
  {
    name: ROUTES.CHAT_ROOM_LIST,
    screen: MessageTab,
    label: 'tab.messages',
    icon: messageIcon,
    activeIcon: messageActiveIcon,
    badge: 'hasUnreadMessage',
  },
];

const AuthStackNavigator = () => {
  const initialRouteName = useSelector((state) => state.user.initialRouteName);

  return (
    <AuthStack.Navigator
      headerMode="none"
      initialRouteName={initialRouteName}
      screenOptions={{gestureEnabled: false}}>
      {auths.map((route, index) => {
        return (
          <AuthStack.Screen
            key={index}
            name={route.name}
            component={route.screen}
          />
        );
      })}
    </AuthStack.Navigator>
  );
};

const AppTabNavigator = (props) => {
  const {theme} = props;
  const indicator = useSelector((state) => state.indicator);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const hasBadge = (checkBadge) => {
    if (checkBadge === 'noBadge') {
      return null;
    }
    return indicator[checkBadge] ? 1 : null;
  };

  return (
    <AppTab.Navigator
      initialRouteName={ROUTES.HOME}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        allowFontScaling: true,
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.grey,
        labelStyle: styles.navTabLabel,
        style: styles.navTabBar,
        safeAreaInsets: {bottom: 8},
      }}>
      {tabs.map((route, index) => {
        return (
          <AppTab.Screen
            key={index}
            name={route.name}
            component={route.screen}
            options={{
              tabBarIcon: ({focused, color, size}) => (
                <Image
                  source={focused ? route.activeIcon : route.icon}
                  style={styles.navTabIcon}
                />
              ),
              tabBarLabel: translate(route.label),
              tabBarBadge: hasBadge(route.badge),
              tabBarBadgeStyle: styles.navTabBadge,
            }}
          />
        );
      })}
    </AppTab.Navigator>
  );
};

const AppNavigation = (props) => {
  const {accessToken} = useSelector((state) => state.user);

  // check required permission(s) on android
  const checkAndroidPermission = useCallback(async () => {
    const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (!hasPermission) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkAndroidPermission();
    }
  }, [checkAndroidPermission]);

  return (
    <NavigationContainer>
      {accessToken ? <AppTabNavigator {...props} /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default withTheme(AppNavigation);
