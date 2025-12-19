import {initialState} from './states';

export const screeningQuestionnaire = (state = initialState, action) => {
  switch (action.type) {
    case 'SCREENING_QUESTIONNAIRE_LIST_FETCH_REQUESTED':
      return {
        ...state,
        loading: true,
        screeningQuestionnaireList: [],
      };
    case 'SCREENING_QUESTIONNAIRE_LIST_FETCH_SUCCEED':
      return {
        ...state,
        loading: false,
        screeningQuestionnaireList: action.data,
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
        screeningQuestionnaireHistoryList: [],
      };
    case 'SCREENING_QUESTIONNAIRE_HISTORY_LIST_FETCH_SUCCEED':
      return {
        ...state,
        loading: false,
        screeningQuestionnaireHistoryList: action.data,
      };
    case 'SCREENING_QUESTIONNAIRE_HISTORY_LIST_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
