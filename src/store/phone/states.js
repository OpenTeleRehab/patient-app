/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import settings from '../../../config/settings';

export const initialState = {
  apiBaseURL: settings.apiBaseURL,
  adminApiBaseURL: settings.adminApiBaseURL,
  therapistApiBaseURL: settings.therapistApiBaseURL,
  chatBaseURL: settings.chatBaseURL,
  chatWebsocketURL: settings.chatWebsocketURL,
  phoneNumber: null,
  clinicId: null,
  organization: null,
};
