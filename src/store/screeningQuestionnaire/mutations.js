// Get Screening Questionnaire List

const screeningQuestionnaireListFetchRequest = () => {
  return {
    type: 'SCREENING_QUESTIONNAIRE_LIST_FETCH_REQUESTED',
  };
};

const screeningQuestionnaireListFetchSuccess = (data) => {
  return {
    type: 'SCREENING_QUESTIONNAIRE_LIST_FETCH_SUCCEED',
    data,
  };
};

const screeningQuestionnaireListFetchFailure = () => {
  return {
    type: 'SCREENING_QUESTIONNAIRE_LIST_FETCH_FAILED',
  };
};

//Submit Screening Questionnaire Answer

const submitScreeningQuestionnaireRequest = () => {
  return {
    type: 'SUBMIT_SCREENING_QUESTIONNAIRE_REQUESTED',
  };
};

const submitScreeningQuestionnaireSuccess = () => {
  return {
    type: 'SUBMIT_SCREENING_QUESTIONNAIRE_SUCCEED',
  };
};

const submitScreeningQuestionnaireFailure = () => {
  return {
    type: 'SUBMIT_SCREENING_QUESTIONNAIRE_FAILED',
  };
};

// Offline Interviews

const submitScreeningQuestionnaireOfflineSuccess = (data) => {
  return {
    type: 'SUBMIT_SCREENING_QUESTIONNAIRE_OFFLINE_SUCCESS',
    data,
  };
};

// Get Screening Questionnaire Histroy List
const screeningQuestionnaireHistoryListFetchRequest = () => {
  return {
    type: 'SCREENING_QUESTIONNAIRE_HISTORY_LIST_FETCH_REQUESTED',
  };
};

const screeningQuestionnaireHistoryListFetchSuccess = (
  userId,
  questionnaireId,
  data,
) => {
  return {
    type: 'SCREENING_QUESTIONNAIRE_HISTORY_LIST_FETCH_SUCCEED',
    userId,
    questionnaireId,
    data,
  };
};

const screeningQuestionnaireHistoryListFetchFailure = () => {
  return {
    type: 'SCREENING_QUESTIONNAIRE_HISTORY_LIST_FETCH_FAILED',
  };
};

export const mutation = {
  screeningQuestionnaireListFetchRequest,
  screeningQuestionnaireListFetchSuccess,
  screeningQuestionnaireListFetchFailure,
  submitScreeningQuestionnaireRequest,
  submitScreeningQuestionnaireSuccess,
  submitScreeningQuestionnaireFailure,
  submitScreeningQuestionnaireOfflineSuccess, //Offline Submit Screening Questionnaries
  screeningQuestionnaireHistoryListFetchRequest,
  screeningQuestionnaireHistoryListFetchSuccess,
  screeningQuestionnaireHistoryListFetchFailure,
};
