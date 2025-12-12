import {initialState} from './states';

export const screeningQuestionnaire = (state = initialState, action) => {
  switch (action.type) {
    case 'SCREENING_QUESTIONNAIRE_LIST_FETCH_REQUESTED':
      return {
        loading: true,
        screeningQuestionnaireList: [],
      };
    case 'SCREENING_QUESTIONNAIRE_LIST_FETCH_SUCCEED':
      return {
        loading: false,
        screeningQuestionnaireList: action.data,
      };
    case 'SCREENING_QUESTIONNAIRE_LIST_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
