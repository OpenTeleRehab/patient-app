// Get Screening Questionnaire List

const screeningQuestionnaireListFetchRequest = () => {
  return {
    type: 'SCREENING_QUESTIONNAIRE_LIST_FETCH_REQUESTED',
  };
};

const screeningQuestionnaireListFetchSuccess = (data) => {
  console.log('Data', data);
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

const submitScreeningQuestionnaireSuccess = (data) => {
  return {
    type: 'SUBMIT_SCREENING_QUESTIONNAIRE_SUCCEED',
    data,
  };
};

const submitScreeningQuestionnaireFailure = () => {
  return {
    type: 'SUBMIT_SCREENING_QUESTIONNAIRE_FAILED',
  };
};

export const mutation = {
  screeningQuestionnaireListFetchRequest,
  screeningQuestionnaireListFetchSuccess,
  screeningQuestionnaireListFetchFailure,
  submitScreeningQuestionnaireRequest,
  submitScreeningQuestionnaireSuccess,
  submitScreeningQuestionnaireFailure,
};
