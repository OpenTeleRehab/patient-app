import {initialState} from './states';

export const screeningQuestionnaire = (state = initialState, action) => {
  switch (action.type) {
    case 'SCREENING_QUESTIONNAIRE_LIST_FETCH_REQUESTED':
      return {
        ...state,
        loading: true,
      };
    case 'SCREENING_QUESTIONNAIRE_LIST_FETCH_SUCCEED':
      return {
        ...state,
        loading: false,
        screeningQuestionnaireListByUser: {
          ...state.screeningQuestionnaireListByUser,
          [action.patientID]: action.data,
        },
      };
    case 'SCREENING_QUESTIONNAIRE_LIST_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      };
    case 'SCREENING_QUESTIONNAIRE_HISTORY_LIST_FETCH_REQUESTED':
      return {
        ...state,
        loading: true,
      };
    case 'SCREENING_QUESTIONNAIRE_HISTORY_LIST_FETCH_SUCCEED':
      return {
        ...state,
        loading: false,
        screeningQuestionnaireHistoryByUser: {
          ...state.screeningQuestionnaireHistoryByUser,
          [`${action.userId}_${action.questionnaireId}`]: action.data,
        },
      };
    case 'SCREENING_QUESTIONNAIRE_HISTORY_LIST_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      };
    case 'SUBMIT_SCREENING_QUESTIONNAIRE_REQUESTED':
      return {
        ...state,
        loading: true,
      };
    case 'SUBMIT_SCREENING_QUESTIONNAIRE_SUCCEEDED':
    case 'SUBMIT_SCREENING_QUESTIONNAIRE_FAILED':
      return {
        ...state,
        loading: false,
      };
    case 'SUBMIT_SCREENING_QUESTIONNAIRE_OFFLINE_SUCCESS':
      return {
        ...state,
        offlineInterviews: action.data,
      };
    default:
      return state;
  }
};
