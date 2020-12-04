/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {ROUTES} from './constants';

// Drawer Navigation
import UserProfileScreen from '../screen/UserProfile';
import PrivacyScreen from '../screen/Privacy';
import AboutScreen from '../screen/About';

// Footer Navigation
import HomeScreen from '../screen/Home';
import ActivityScreen from '../screen/Activity';
import GoalScreen from '../screen/Goal';
import AppointmentScreen from '../screen/Appointment';
import MessageScreen from '../screen/Message';

export const drawerRoutes = [
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

export const footerRoutes = [
  {
    name: ROUTES.HOME,
    screen: HomeScreen,
    label: 'Home',
    icon: 'home',
  },
  {
    name: ROUTES.ACTIVITY,
    screen: ActivityScreen,
    label: 'Activities',
    icon: 'handball',
  },
  {
    name: ROUTES.GOAL,
    screen: GoalScreen,
    label: 'Goals',
    icon: 'bullseye-arrow',
  },
  {
    name: ROUTES.APPOINTMENT,
    screen: AppointmentScreen,
    label: 'Appointments',
    icon: 'calendar-clock',
  },
  {
    name: ROUTES.MESSAGE,
    screen: MessageScreen,
    label: 'Messages',
    icon: 'message-text-outline',
  },
];
