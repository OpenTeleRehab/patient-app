/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
import React from 'react';
import {Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Text} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ROUTES} from '../variables/constants';
import {mutation} from '../store/rocketchat/mutations';

import HomeScreen from '../screen/Home';
import ActivityScreen from '../screen/Activity';
import AppointmentScreen from '../screen/Appointment';
import PatientScreen from '../screen/Patient';
import TransferScreen from '../screen/Transfer';
import PhcAppointmentScreen from '../screen/PhcAppointment';
import ChatRoomListScreenScreen from '../screen/ChatOrCall/ChatRoomList';
import variables from '../assets/styles/variables';

import homeIcon from '../assets/images/home-icon.png';
import homeActiveIcon from '../assets/images/home-active-icon.png';
import activityIcon from '../assets/images/activity-icon.png';
import activityActiveIcon from '../assets/images/activity-active-icon.png';
import appointmentIcon from '../assets/images/appointment-icon.png';
import appointmentActiveIcon from '../assets/images/appointment-active-icon.png';
import patientIcon from '../assets/images/patient-icon.png';
import patientActiveIcon from '../assets/images/patient-active-icon.png';
import transferIcon from '../assets/images/transfer-icon.png';
import transferActiveIcon from '../assets/images/transfer-active-icon.png';
import messageIcon from '../assets/images/message-icon.png';
import messageActiveIcon from '../assets/images/message-active-icon.png';

const Tab = createBottomTabNavigator();

const tabBarIcon = (tab, focused) => {
  const iconSize = 26;

  return (
    <Image
      source={focused ? tab.activeIcon : tab.icon}
      style={{
        height: iconSize,
        width: iconSize,
      }}
    />
  );
};

const tabBarLabel = (label, focused) => (
  <Text
    maxFontSizeMultiplier={1}
    numberOfLines={1}
    style={{color: focused ? variables.primary : variables.grey}}>
    {label}
  </Text>
);

const BottomTabNavigator = () => {
  const dispatch = useDispatch();
  const indicator = useSelector((state) => state.indicator);
  const {profile} = useSelector((state) => state.user);
  const {chatRooms} = useSelector((state) => state.rocketchat);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  // Unread counts live on each chat room, not in the indicator store.
  const hasUnreadMessage = chatRooms?.some((room) => room.unreads > 0);

  const hasBadge = (checkBadge) => {
    if (checkBadge === 'hasUnreadMessage') {
      return hasUnreadMessage ? 1 : null;
    }
    return indicator[checkBadge] ? 1 : null;
  };

  let initialRouteName = ROUTES.HOME;
  let tabs = [
    {
      name: ROUTES.HOME,
      screen: HomeScreen,
      label: 'tab.home',
      icon: homeIcon,
      activeIcon: homeActiveIcon,
    },
    {
      name: ROUTES.ACTIVITY,
      screen: ActivityScreen,
      label: 'tab.activities',
      icon: activityIcon,
      activeIcon: activityActiveIcon,
      badge: 'hasActivity',
    },
    {
      name: ROUTES.APPOINTMENT,
      screen: AppointmentScreen,
      label: 'tab.appointments',
      icon: appointmentIcon,
      activeIcon: appointmentActiveIcon,
      badge: 'hasAppointment',
    },
    {
      name: ROUTES.CHAT_ROOM_LIST,
      screen: ChatRoomListScreenScreen,
      label: 'tab.messages',
      icon: messageIcon,
      activeIcon: messageActiveIcon,
      badge: 'hasUnreadMessage',
    },
  ];

  if (profile?.type === 'phc_worker') {
    initialRouteName = ROUTES.PATIENT;
    tabs = [
      {
        name: ROUTES.PATIENT,
        screen: PatientScreen,
        label: 'tab.patient',
        icon: patientIcon,
        activeIcon: patientActiveIcon,
      },
      {
        name: ROUTES.TRANSFER,
        screen: TransferScreen,
        label: 'tab.transfer',
        icon: transferIcon,
        activeIcon: transferActiveIcon,
        badge: 'hasTransfer',
      },
      {
        name: ROUTES.PHC_APPOINTMENT,
        screen: PhcAppointmentScreen,
        label: 'tab.appointments',
        icon: appointmentIcon,
        activeIcon: appointmentActiveIcon,
        badge: 'hasAppointment',
      },
      {
        name: ROUTES.CHAT_ROOM_LIST,
        screen: ChatRoomListScreenScreen,
        label: 'tab.messages',
        icon: messageIcon,
        activeIcon: messageActiveIcon,
        badge: 'hasUnreadMessage',
      },
    ];
  }

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}>
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.screen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => tabBarIcon(tab, focused),
            tabBarLabel: ({focused}) => tabBarLabel(translate(tab.label), focused),
            tabBarStyle: {
              height: 74,
            },
            tabBarBadge: hasBadge(tab.badge),
            tabBarBadgeStyle: {
              backgroundColor: variables.danger,
              color: variables.danger,
              maxWidth: 12,
              maxHeight: 12,
            },
          }}
          listeners={({navigation, route}) => ({
            tabPress: (e) => {
              // Online with the chat server down, ChatPanel can't load or send, and skipping the room list
              // also skips its server-down view and Retry. Offline the shortcut stays: cached history is
              // readable and messages queue for later.
              const isChatDown = indicator.isOnlineMode && indicator.isChatServerDown;

              if (
                route.name === ROUTES.CHAT_ROOM_LIST &&
                chatRooms.length === 1 &&
                !isChatDown
              ) {
                // Prevent the default action
                e.preventDefault();

                // Change navigate to chat panel; it shows the room's persisted history from chatRooms
                dispatch(mutation.selectRoomSuccess(chatRooms[0]));
                navigation.navigate(ROUTES.CHAT_PANEL);
              }
            },
          })}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
