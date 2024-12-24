const publishSurveyfetchRequest = () => {
  return {
    type: 'PUBLISH_SURVEY_FETCH_REQUESTED',
  };
};

const publishSurveyfetchSuccess = (data) => {
  return {
    type: 'PUBLISH_SURVEY_FETCH_SUCCESSED',
    data,
  };
};

const publishSurveyfetchFailure = () => {
  return {
    type: 'PUBLISH_SURVEY_FETCH_FAILED',
  };
};

const submitSurveyRequest = () => {
  return {
    type: 'SUBMIT_SURVEY_REQUESTED',
  };
};

const submitSurveySuccess = (data) => {
  return {
    type: 'SUBMIT_SURVEY_SUCCESSED',
    data,
  };
};

const submitSurveyFailure = () => {
  return {
    type: 'SUBMIT_SURVEY_FAILED',
  };
};

const skipSurveyRequest = () => {
  return {
    type: 'SKIP_SURVEY_REQUESTED',
  };
};

const skipSurveySuccess = (data) => {
  return {
    type: 'SKIP_SURVEY_SUCCESSED',
    data,
  };
};

const skipSurveyFailure = () => {
  return {
    type: 'SKIP_SURVEY_FAILED',
  };
};

export const mutation = {
  publishSurveyfetchRequest,
  publishSurveyfetchSuccess,
  publishSurveyfetchFailure,
  submitSurveyRequest,
  submitSurveySuccess,
  submitSurveyFailure,
  skipSurveyRequest,
  skipSurveySuccess,
  skipSurveyFailure,
};
