/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {ROUTES} from './constants';

// Auth Group
import LoginScreen from '../screen/Auth/Login';
import RegisterScreen from '../screen/Auth/Register';
import ForgotPasswordScreen from '../screen/Auth/ForgotPassword';
import TermOfServiceScreen from '../screen/Auth/TermOfService';
import TermOfServiceDetailScreen from '../screen/Auth/TermOfService/detail';
import PrivacyPolicyDetailScreen from '../screen/Auth/TermOfService/PrivacyDetail';
import VerifyPhoneScreen from '../screen/Auth/VerifyPhone';
import SetupPinScreen from '../screen/Auth/SetupPin';

// Home group
import AboutScreen from '../screen/About';
import HelpScreen from '../screen/Help';
import FaqScreen from '../screen/Faq';
import TermConditionScreen from '../screen/TermCondition';
import PrivacyPolicyScreen from '../screen/PrivacyPolicy';
import UserProfileScreen from '../screen/UserProfile';
import UserProfileEditScreen from '../screen/UserProfile/edit';
import ConfirmPinScreen from '../screen/UserProfile/ConfirmPin';
import AchievementScreen from '../screen/Achievement';

// Activity group
import CompleteTaskScreen from '../screen/Activity/CompleteTask';
import ExerciseDetailScreen from '../screen/Activity/Detail/ExerciseDetail';
import MaterialDetailScreen from '../screen/Activity/Detail/MaterialDetail';
import QuestionnaireDetailScreen from '../screen/Activity/Detail/QuestionnaireDetail';
import GoalDetailScreen from '../screen/Activity/Detail/GoalDetail';

// Appointment group
import AppointmentDetailScreen from '../screen/Appointment/detail';

// Message group
import ChatPanelScreen from '../screen/ChatOrCall/ChatPanel';

// Health worker group
import ChangePasswordScreen from '../screen/UserProfile/ChangePassword';
import CreateOrEditPatientScreen from '../screen/Patient/_Partials/CreateOrEdit';
import PatientDetailScreen from '../screen/Patient/_Partials/PatientDetail';
import PatientReferralScreen from '../screen/Patient/_Partials/PatientReferral';
import PatientTransferScreen from '../screen/Patient/_Partials/PatientTransfer';
import InterviewScreen from '../screen/Interview';
import InterviewListScreen from '../screen/Interview/InterviewList';
import InterviewHistoryListScreen from '../screen/Interview/InterviewHistoryList';
import InterviewStackNavigator from '../screen/Interview/StackNavigator';
import InterviewDetail from '../screen/Interview/InterviewDetail';

export const drawerItems = [
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
    name: ROUTES.HELP,
    screen: HelpScreen,
    label: 'menu.help',
    icon: 'help-circle',
  },
];

export const auths = [
  {
    name: ROUTES.REGISTER,
    screen: RegisterScreen,
  },
  {
    name: ROUTES.FORGOTPASSWORD,
    screen: ForgotPasswordScreen,
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

export const activities = [
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
    name: ROUTES.APPOINTMENT_DETAIL,
    screen: AppointmentDetailScreen,
  },
];

export const patients = [
  {
    name: ROUTES.CREATE_EDIT_PATIENT,
    screen: CreateOrEditPatientScreen,
  },
  {
    name: ROUTES.PATIENT_DETAIL,
    screen: PatientDetailScreen,
  },
  {
    name: ROUTES.PATIENT_REFERRAL,
    screen: PatientReferralScreen,
  },
  {
    name: ROUTES.PATIENT_TRANSFER,
    screen: PatientTransferScreen,
  },
  {
    name: ROUTES.INTERVIEW_STACK,
    screen: InterviewStackNavigator,
  },
];

export const interviews = [
  {
    name: ROUTES.INTERVIEW,
    screen: InterviewScreen,
  },
  {
    name: ROUTES.INTERVIEW_LIST,
    screen: InterviewListScreen,
  },
  {
    name: ROUTES.INTERVIEW_DETAIL,
    screen: InterviewDetail,
  },
  {
    name: ROUTES.INTERVIEW_HISTORY_LIST,
    screen: InterviewHistoryListScreen,
  },
];

export const messages = [
  {
    name: ROUTES.CHAT_PANEL,
    screen: ChatPanelScreen,
  },
];

export const miscellaneous = [
  {
    name: ROUTES.ACHIEVEMENT,
    screen: AchievementScreen,
  },
  {
    name: ROUTES.USER_PROFILE_EDIT,
    screen: UserProfileEditScreen,
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
    name: ROUTES.CHANGE_PASSWORD,
    screen: ChangePasswordScreen,
  },
];
