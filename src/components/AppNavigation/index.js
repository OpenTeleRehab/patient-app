/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {PermissionsAndroid, Platform} from 'react-native';
import {withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeTab from './Tab/HomeTab';
import ActivityTab from './Tab/ActivityTab';
import AppointmentTab from './Tab/AppointmentTab';
import MessageTab from './Tab/MessageTab';
import {ROUTES} from '../../variables/constants';
import {auths} from '../../variables/routes';
import styles from '../../assets/styles';

const AuthStack = createStackNavigator();
const AppTab = createBottomTabNavigator();

const tabs = [
  {
    name: ROUTES.HOME,
    screen: HomeTab,
    label: 'tab.home',
    icon: 'home',
    badge: 'noBadge',
  },
  {
    name: ROUTES.ACTIVITY,
    screen: ActivityTab,
    label: 'tab.activities',
    icon: 'handball',
    badge: 'hasActivity',
  },
  {
    name: ROUTES.APPOINTMENT,
    screen: AppointmentTab,
    label: 'tab.appointments',
    icon: 'calendar-clock',
    badge: 'hasAppointment',
  },
  {
    name: ROUTES.CHAT_ROOM_LIST,
    screen: MessageTab,
    label: 'tab.messages',
    icon: 'message-text-outline',
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
        safeAreaInsets: {bottom: 5},
      }}>
      {tabs.map((route, index) => {
        return (
          <AppTab.Screen
            key={index}
            name={route.name}
            component={route.screen}
            options={{
              tabBarIcon: ({focused, color, size}) => (
                <MCIcon name={route.icon} color={color} size={size} />
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
