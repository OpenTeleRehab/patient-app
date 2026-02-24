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
import PatientTab from './Tab/PatientTab';
import TransferTab from './Tab/TransferTab';
import PhcAppointmentTab from './Tab/PhcAppointmentTab';
import {ROUTES, USER_ROLE} from '../../variables/constants';
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
import patientIcon from '../../assets/images/patient-icon.png';
import patientActiveIcon from '../../assets/images/patient-active-icon.png';
import transferIcon from '../../assets/images/transfer-icon.png';
import transferActiveIcon from '../../assets/images/transfer-active-icon.png';

import CommonPopup from '../Common/Popup';
import {getAppSettingsRequest} from '../../store/appSetting/actions';
import {mutation} from '../../store/appSetting/mutations';
import Survey from '../Survey';
import JailMonkey from 'jail-monkey';
import {PERMISSIONS, request} from 'react-native-permissions';
import settings from '../../../config/settings';

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabs = [
  {
    name: ROUTES.HOME,
    screen: HomeTab,
    label: 'tab.home',
    icon: homeIcon,
    activeIcon: homeActiveIcon,
    badge: 'noBadge',
    group: USER_ROLE.PATIENT,
  },
  {
    name: ROUTES.ACTIVITY,
    screen: ActivityTab,
    label: 'tab.activities',
    icon: activityIcon,
    activeIcon: activityActiveIcon,
    badge: 'hasActivity',
    group: USER_ROLE.PATIENT,
  },
  {
    name: ROUTES.APPOINTMENT,
    screen: AppointmentTab,
    label: 'tab.appointments',
    icon: appointmentIcon,
    activeIcon: appointmentActiveIcon,
    badge: 'hasAppointment',
    group: USER_ROLE.PATIENT,
  },
  {
    name: ROUTES.CHAT_ROOM_LIST,
    screen: MessageTab,
    label: 'tab.messages',
    icon: messageIcon,
    activeIcon: messageActiveIcon,
    badge: 'hasUnreadMessage',
    group: USER_ROLE.PATIENT,
  },
  {
    name: ROUTES.PATIENT,
    screen: PatientTab,
    label: 'tab.patient',
    icon: patientIcon,
    activeIcon: patientActiveIcon,
    badge: 'noBadge',
    group: USER_ROLE.HEALTH_WORKER,
  },
  {
    name: ROUTES.TRANSFER,
    screen: TransferTab,
    label: 'tab.transfer',
    icon: transferIcon,
    activeIcon: transferActiveIcon,
    badge: 'hasTransfer',
    group: USER_ROLE.HEALTH_WORKER,
  },
  {
    name: ROUTES.PHC_APPOINTMENT,
    screen: PhcAppointmentTab,
    label: 'tab.appointments',
    icon: appointmentIcon,
    activeIcon: appointmentActiveIcon,
    badge: 'hasAppointment',
    group: USER_ROLE.HEALTH_WORKER,
  },
  {
    name: ROUTES.CHAT_ROOM_LIST,
    screen: MessageTab,
    label: 'tab.messages',
    icon: messageIcon,
    activeIcon: messageActiveIcon,
    badge: 'hasUnreadMessage',
    group: USER_ROLE.HEALTH_WORKER,
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
  const {registerAs} = useSelector((state) => state.user);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const hasBadge = (checkBadge) => {
    if (checkBadge === 'noBadge') {
      return null;
    }
    return indicator[checkBadge] ? 1 : null;
  };

  return (
    <Tab.Navigator
      initialRouteName={
        registerAs === USER_ROLE.HEALTH_WORKER ? ROUTES.PATIENT : ROUTES.HOME
      }
      screenOptions={{
        headerShown: false
      }}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.grey,
        labelStyle: styles.navTabLabel,
        style: styles.navTabBar,
        safeAreaInsets: {bottom: 8},
      }}>
      {tabs
        .filter((item) => item.group === registerAs)
        .map((tab, index) => {
          return (
            <Tab.Screen
              key={index}
              name={tab.name}
              component={tab.screen}
              options={{
                tabBarIcon: ({focused}) => iconRenderer(tab, focused),
                tabBarLabel: ({focused}) => renderText(translate(tab.label)),
                tabBarBadge: hasBadge(tab.badge),
                tabBarBadgeStyle: styles.navTabBadge,
              }}
            />
          );
        })}
    </Tab.Navigator>
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
    const hasAudioPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    const hasCameraPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    const hasStoragePermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
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
                ? Linking.openURL(settings.playStoreURL)
                : Linking.openURL(settings.appStoreURL)
            }
            tittle={translate('app.update.title')}
            message={translate(
              appForceUpdate
                ? 'app.update.message.force'
                : 'app.update.message',
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
          ) : (
            <AuthStackNavigator />
          )}
        </>
      )}
    </NavigationContainer>
  );
};

export default withTheme(AppNavigation);
