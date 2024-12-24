/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const phone = (state = initialState, action) => {
  switch (action.type) {
    case 'PHONE_FETCH_SUCCEED':
      return Object.assign({}, state, {
        apiBaseURL: action.data.patient_api_url,
        adminApiBaseURL: action.data.admin_api_url,
        therapistApiBaseURL: action.data.therapist_api_url,
        chatBaseURL: action.data.chat_api_url,
        chatWebsocketURL: action.data.chat_websocket_url,
        phoneNumber: action.data.phone,
        clinicId: action.data.clinic_id,
        organization: action.data.organization_name,
      });
    default:
      return state;
  }
};
