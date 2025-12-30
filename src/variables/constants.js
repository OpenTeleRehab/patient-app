/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
export const ROUTES = {
  LOGIN: 'Login',
  VERIFY_PHONE: 'VerifyPhone',
  HOME: 'Home',
  PATIENT: 'Patient',
  TRANSFER: 'Transfer',
  ACTIVITY: 'Activity',
  EXERCISE_DETAIL: 'ExerciseDetail',
  COMPLETE_EXERCISE: 'CompleteExercise',
  MATERIAL_DETAIL: 'MaterialDetail',
  QUESTIONNAIRE_DETAIL: 'QuestionnaireDetail',
  APPOINTMENT: 'Appointment',
  APPOINTMENT_DETAIL: 'AppointmentDetail',
  USER_PROFILE: 'UserProfile',
  USER_PROFILE_EDIT: 'UserProfileEdit',
  ABOUT: 'About',
  HELP: 'Help',
  REGISTER: 'Register',
  FORGOTPASSWORD: 'ForgotPassword',
  TERM_OF_SERVICE: 'TermOfService',
  TERM_OF_SERVICE_DETAIL: 'TermOfServiceDetail',
  PRIVACY_POLICY_DETAIL: 'PrivacyPolicyDetail',
  SETUP_PIN: 'SetupPIN',
  CONFIRM_PIN: 'ConfirmPin',
  CHANGE_PASSWORD: 'ChangePassword',
  GOAl_DETAIL: 'GoalDetail',
  CHAT_ROOM_LIST: 'ChatRoomList',
  CHAT_PANEL: 'ChatPanel',
  FAQ: 'Faq',
  TC: 'TermCondition',
  PP: 'PrivacyPolicy',
  ACHIEVEMENT: 'Achievement',
  CREATE_EDIT_PATIENT: 'CreateOrEditPatient',
  PATIENT_DETAIL: 'PatientDetail',
  PATIENT_REFERRAL: 'PatientReferral',
  PATIENT_TRANSFER: 'PatientTransfer',
  INTERVIEW: 'Interview',
  INTERVIEW_STACK: 'InterviewStack',
  INTERVIEW_LIST: 'InterviewList',
  INTERVIEW_HISTORY_LIST: 'InterviewHistoryList',
  INTERVIEW_DETAIL: 'InterviewDetail',
};

export const STORAGE_KEY = {
  AUTH_INFO: 'AuthInfo',
  LANGUAGE: 'Language',
  TRANSLATE: 'Translate',
  CALL_INFO: 'CallInfo',
  REJECTED_CALL: 'RejectedCall',
};

export const ACTIVITY_TYPES = {
  EXERCISE: 'exercise',
  MATERIAL: 'material',
  QUESTIONNAIRE: 'questionnaire',
  GOAL: 'goal',
};

export const CHAT_USER_STATUS = {
  0: 'offline',
  1: 'online',
  2: 'away',
  3: 'busy',
  ONLINE: 'online',
  OFFLINE: 'offline',
};

export const CALL_STATUS = {
  AUDIO_STARTED: 'jitsi_call_audio_started',
  AUDIO_MISSED: 'jitsi_call_audio_missed',
  AUDIO_ENDED: 'jitsi_call_audio_ended',
  VIDEO_STARTED: 'jitsi_call_video_started',
  VIDEO_MISSED: 'jitsi_call_video_missed',
  VIDEO_ENDED: 'jitsi_call_video_ended',
  ACCEPTED: 'jitsi_call_accepted',
  BUSY: 'jitsi_call_busy',
};

export const APPOINTMENT_STATUS = {
  INVITED: 'invited',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const TTS = {
  DEFAULT_SPEECH_RATE: 0.5,
  DEFAULT_SPEECH_PITCH: 1,
};

export const MATERIAL_TYPE = {
  image: 'common.type.image',
};

export const SURVEY_FREQUENCY = {
  WEEKLY: 'weekly',
  DAILY: 'daily',
};

export const USER_ROLE = {
  PATIENT: 'patient',
  HEALTH_WORKER: 'health_worker',
};

export const TREATMENT_STATUS = {
  ONGOING: 'ongoing',
  PLANNED: 'planned',
  FINISHED: 'finished',
};

export const TRANSFER_STATUS = {
  INVITED: 'invited',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
};

export const REFERRAL_STATUS = {
  INVITED: 'invited',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
};

export const THERAPIST_TYPES = {
  LEAD: 'lead',
  SUPPLEMENTARY: 'supplementary',
};
