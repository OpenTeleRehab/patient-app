/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Image, Linking, PermissionsAndroid, Platform} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import DeviceInfo from 'react-native-device-info';
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
import CommonPopup from '../Common/Popup';
import {getAppSettingsRequest} from '../../store/appSetting/actions';
import {mutation} from '../../store/appSetting/mutations';
import Survey from '../Survey';
import JailMonkey from 'jail-monkey';
import {PERMISSIONS, request} from 'react-native-permissions';

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

const iconRenderer = (route, focused) => (
  <Image
    source={focused ? route.activeIcon : route.icon}
    style={styles.navTabIcon}
  />
);

const renderText = (label) => <Text maxFontSizeMultiplier={1}>{label}</Text>;

const AuthStackNavigator = () => {
  const initialRouteName = useSelector((state) => state.user.initialRouteName);

  return (
    <AuthStack.Navigator
      headerMode="none"
      initialRouteName={initialRouteName || ROUTES.REGISTER}
      screenOptions={{gestureEnabled: false, headerShown: false}}>
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
      screenOptions={{ headerShown: false }}
      tabBarOptions={{
        keyboardHidesTabBar: true,
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
              tabBarIcon: ({focused}) => iconRenderer(route, focused),
              tabBarLabel: ({focused}) => renderText(translate(route.label)),
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
  const dispatch = useDispatch();
  const {accessToken} = useSelector((state) => state.user);
  const localize = useSelector((state) => state.localize);
  const {appVersion, skipVersion} = useSelector((state) => state.appSettings);
  const [appOutdatedPopup, setAppOutdatedPopup] = useState(false);
  const [appForceUpdate, setAppForceUpdate] = useState(false);
  const [isJailedBroken, setIsJailedBroken] = useState(false);
  const translate = getTranslate(localize);

  // check required permission(s) on android
  const checkAndroidPermission = useCallback(async () => {
    const hasAudioPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    const hasCameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    const hasStoragePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    if (!hasAudioPermission || !hasCameraPermission || !hasStoragePermission) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  }, []);

  const checkIosPermission = useCallback(async () => {
    await request(PERMISSIONS.IOS.MICROPHONE);
    await request(PERMISSIONS.IOS.CAMERA);
  }, []);

  useEffect(() => {
    // Check if device is jail-broken or rooted
    setIsJailedBroken(JailMonkey.isJailBroken());
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkAndroidPermission();
    } else {
      checkIosPermission();
    }
  }, [checkAndroidPermission, checkIosPermission]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      dispatch(getAppSettingsRequest({name: 'android'}));
    } else {
      dispatch(getAppSettingsRequest({name: 'ios'}));
    }
  }, [dispatch]);

  useEffect(() => {
    if (appVersion && appVersion.length > 0) {
      const force = appVersion.includes('f');
      const version = parseInt(DeviceInfo.getBuildNumber(), 10);
      const requiredVersion = parseInt(appVersion, 10);
      if (
        (version < requiredVersion && skipVersion !== requiredVersion) ||
        (force && skipVersion === requiredVersion)
      ) {
        setAppOutdatedPopup(true);
        setAppForceUpdate(force);
      } else {
        setAppOutdatedPopup(false);
      }
    }
  }, [appVersion, skipVersion]);

  return (
    <NavigationContainer>
      <CommonPopup
        popup={isJailedBroken}
        iconType="material"
        iconName="warning"
        tittle={translate('device.root.detected')}
        message={translate('device.root.detected.message')}
      />
      {!isJailedBroken && (
        <>
          <CommonPopup
            popup={appOutdatedPopup}
            iconType="material"
            iconName="update"
            onConfirm={() =>
              Platform.OS === 'android'
                ? Linking.openURL('market://details?id=org.hi.patient')
                : Linking.openURL(
                  'https://apps.apple.com/kh/app/opentelerehab/id1553715804',
                )
            }
            tittle={translate('app.update.title')}
            message={translate(
              appForceUpdate ? 'app.update.message.force' : 'app.update.message',
            )}
            onCancel={
              appForceUpdate
                ? null
                : () => {
                  setAppOutdatedPopup(false);
                  appVersion &&
                  appVersion.length > 0 &&
                  dispatch(
                    mutation.appSettingsUpdateSkipVersion(
                      parseInt(appVersion, 10),
                    ),
                  );
                }
            }
          />
          {accessToken ? (
              <>
                <AppTabNavigator {...props} />
                <Survey />
              </>
            )
            : <AuthStackNavigator />}
        </>
      )}
    </NavigationContainer>
  );
};

export default withTheme(AppNavigation);
