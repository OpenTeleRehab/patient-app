/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {ROUTES} from './constants';

// Auth Group
import LoginScreen from '../screen/Login';

// Home group
import HomeScreen from '../screen/Home';
import UserProfileScreen from '../screen/UserProfile';
import PrivacyScreen from '../screen/Privacy';
import AboutScreen from '../screen/About';

// Activity group
import ActivityScreen from '../screen/Activity';

// Goal group
import GoalScreen from '../screen/Goal';

// Appointment group
import AppointmentScreen from '../screen/Appointment';

// Term of Service group
import TermOfServiceScreen from '../screen/TermOfService';
import TermOfServiceDetailScreen from '../screen/TermOfService/detail';

export const auths = [
  {
    name: ROUTES.TERM_OF_SERVICE,
    screen: TermOfServiceScreen,
  },
  {
    name: ROUTES.TERM_OF_SERVICE_DETAIL,
    screen: TermOfServiceDetailScreen,
  },
  {
    name: ROUTES.LOGIN,
    screen: LoginScreen,
  },
];

export const homes = [
  {
    name: ROUTES.HOME,
    screen: HomeScreen,
  },
  {
    name: ROUTES.USER_PROFILE,
    screen: UserProfileScreen,
    label: 'User Profile',
    icon: 'user',
  },
  {
    name: ROUTES.PRIVACY,
    screen: PrivacyScreen,
    label: 'Privacy Policy',
    icon: 'settings',
  },
  {
    name: ROUTES.ABOUT,
    screen: AboutScreen,
    label: 'About the App',
    icon: 'info',
  },
];

export const activities = [
  {
    name: ROUTES.ACTIVITY,
    screen: ActivityScreen,
  },
];

export const goals = [
  {
    name: ROUTES.GOAL,
    screen: GoalScreen,
  },
];

export const appointments = [
  {
    name: ROUTES.APPOINTMENT,
    screen: AppointmentScreen,
  },
];
