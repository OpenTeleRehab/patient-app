/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {ROUTES} from './constants';

// Auth Group
import LoginScreen from '../screen/Auth/Login';
import RegisterScreen from '../screen/Auth/Register';
import TermOfServiceScreen from '../screen/Auth/TermOfService';
import TermOfServiceDetailScreen from '../screen/Auth/TermOfService/detail';
import PrivacyPolicyDetailScreen from '../screen/Auth/TermOfService/PrivacyDetail';
import VerifyPhoneScreen from '../screen/Auth/VerifyPhone';
import SetupPinScreen from '../screen/Auth/SetupPin';

// Home group
import HomeScreen from '../screen/Home';
import UserProfileEditScreen from '../screen/UserProfile/edit';
import AboutScreen from '../screen/About';
import FaqScreen from '../screen/Faq';
import TermConditionScreen from '../screen/TermCondition';
import PrivacyPolicyScreen from '../screen/PrivacyPolicy';
import UserProfileScreen from '../screen/UserProfile';
import ConfirmPinScreen from '../screen/UserProfile/ConfirmPin';

// Activity group
import ActivityScreen from '../screen/Activity';
import CompleteTaskScreen from '../screen/Activity/CompleteTask';
import ExerciseDetailScreen from '../screen/Activity/Detail/ExerciseDetail';
import MaterialDetailScreen from '../screen/Activity/Detail/MaterialDetail';
import QuestionnaireDetailScreen from '../screen/Activity/Detail/QuestionnaireDetail';
import GoalDetailScreen from '../screen/Activity/Detail/GoalDetail';

// Appointment group
import AppointmentScreen from '../screen/Appointment';
import AppointmentDetailScreen from '../screen/Appointment/detail';

// Message group
import ChatRoomListScreen from '../screen/ChatOrCall/ChatRoomList';
import ChatPanelScreen from '../screen/ChatOrCall/ChatPanel';

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
    name: ROUTES.PRIVACY_POLICY_DETAIL,
    screen: PrivacyPolicyDetailScreen,
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
    name: ROUTES.FAQ,
    screen: FaqScreen,
    label: 'menu.faq',
    icon: 'help-circle',
  },
  {
    name: ROUTES.TC,
    screen: TermConditionScreen,
    label: 'menu.tc',
    icon: 'file-text',
  },
  {
    name: ROUTES.PP,
    screen: PrivacyPolicyScreen,
    label: 'menu.pp',
    icon: 'file-text',
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
  {
    name: ROUTES.EXERCISE_DETAIL,
    screen: ExerciseDetailScreen,
  },
  {
    name: ROUTES.COMPLETE_EXERCISE,
    screen: CompleteTaskScreen,
  },
  {
    name: ROUTES.MATERIAL_DETAIL,
    screen: MaterialDetailScreen,
  },
  {
    name: ROUTES.QUESTIONNAIRE_DETAIL,
    screen: QuestionnaireDetailScreen,
  },
  {
    name: ROUTES.GOAl_DETAIL,
    screen: GoalDetailScreen,
  },
];

export const appointments = [
  {
    name: ROUTES.APPOINTMENT,
    screen: AppointmentScreen,
  },
  {
    name: ROUTES.APPOINTMENT_DETAIL,
    screen: AppointmentDetailScreen,
  },
];

export const messages = [
  {
    name: ROUTES.CHAT_ROOM_LIST,
    screen: ChatRoomListScreen,
  },
  {
    name: ROUTES.CHAT_PANEL,
    screen: ChatPanelScreen,
  },
];
