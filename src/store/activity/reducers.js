/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {initialState} from './states';

export const activity = (state = initialState, action) => {
  switch (action.type) {
    case 'TREATMENT_PLAN_FETCH_SUCCEED':
      return Object.assign({}, state, {
        treatmentPlan: action.data,
        isLoading: false,
      });
    case 'TODAY_ACTIVITY_SUMMARY_REQUEST_SUCCEED':
      return Object.assign({}, state, {
        todaySummary: action.data,
      });
    case 'TREATMENT_PLAN_FETCH_REQUESTED':
    case 'COMPLETE_ACTIVITY_REQUEST':
    case 'COMPLETE_QUESTIONNAIRE_REQUEST':
      return Object.assign({}, state, {
        isLoading: true,
      });
    case 'COMPLETE_ACTIVITY_SUCCEED':
    case 'COMPLETE_ACTIVITY_FAILED':
    case 'COMPLETE_QUESTIONNAIRE_SUCCEED':
    case 'COMPLETE_QUESTIONNAIRE_FAILED':
      return Object.assign({}, state, {
        isLoading: false,
      });
    default:
      return state;
  }
};
