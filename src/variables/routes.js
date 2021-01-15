/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {ROUTES} from './constants';

// Auth Group
import LoginScreen from '../screen/Auth/Login';
import RegisterScreen from '../screen/Auth/Register';
import TermOfServiceScreen from '../screen/Auth/TermOfService';
import TermOfServiceDetailScreen from '../screen/Auth/TermOfService/detail';
import VerifyPhoneScreen from '../screen/Auth/VerifyPhone';
import SetupPinScreen from '../screen/Auth/SetupPin';

// Home group
import HomeScreen from '../screen/Home';
import UserProfileEditScreen from '../screen/UserProfile/edit';
import PrivacyScreen from '../screen/Privacy';
import AboutScreen from '../screen/About';
import UserProfileScreen from '../screen/UserProfile';
import ConfirmPinScreen from '../screen/UserProfile/ConfirmPin';

// Activity group
import ActivityScreen from '../screen/Activity';

// Goal group
import GoalScreen from '../screen/Goal';

// Appointment group
import AppointmentScreen from '../screen/Appointment';

export const auths = [
  {
    name: ROUTES.REGISTER,
    screen: RegisterScreen,
  },
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
  {
    name: ROUTES.VERIFY_PHONE,
    screen: VerifyPhoneScreen,
  },
  {
    name: ROUTES.SETUP_PIN,
    screen: SetupPinScreen,
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
    label: 'menu.user.profile',
    icon: 'user',
  },
  {
    name: ROUTES.PRIVACY,
    screen: PrivacyScreen,
    label: 'menu.privacy',
    icon: 'settings',
  },
  {
    name: ROUTES.ABOUT,
    screen: AboutScreen,
    label: 'menu.about.app',
    icon: 'info',
  },
  {
    name: ROUTES.CONFIRM_PIN,
    screen: ConfirmPinScreen,
  },
  {
    name: ROUTES.SETUP_PIN,
    screen: SetupPinScreen,
  },
  {
    name: ROUTES.USER_PROFILE_EDIT,
    screen: UserProfileEditScreen,
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
