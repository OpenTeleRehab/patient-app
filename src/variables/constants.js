/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
export const ROUTES = {
  LOGIN: 'Login',
  VERIFY_PHONE: 'VerifyPhone',
  HOME: 'Home',
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
  REGISTER: 'Register',
  TERM_OF_SERVICE: 'TermOfService',
  TERM_OF_SERVICE_DETAIL: 'TermOfServiceDetail',
  PRIVACY_POLICY_DETAIL: 'PrivacyPolicyDetail',
  SETUP_PIN: 'SetupPIN',
  CONFIRM_PIN: 'ConfirmPin',
  GOAl_DETAIL: 'GoalDetail',
  CHAT_ROOM_LIST: 'ChatRoomList',
  CHAT_PANEL: 'ChatPanel',
  FAQ: 'Faq',
};

export const STORAGE_KEY = {
  AUTH_INFO: 'AuthInfo',
  LANGUAGE: 'Language',
  TRANSLATE: 'Translate',
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
