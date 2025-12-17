import {callApi} from '../utils/request';

const getScreeningQuestionnaireList = async (accessToken) => {
  return await callApi('/screening-questionnaires', accessToken);
};

const submitScreeningQuestionnaireAnswer = async (
  screeningQuestionnaireId,
  payload,
  accessToken,
) => {
  return await callApi(
    `/screening-questionnaires/${screeningQuestionnaireId}/submit`,
    accessToken,
    payload,
    'post',
    true,
  );
};

export const ScreeningQuestionnaire = {
  getScreeningQuestionnaireList,
  submitScreeningQuestionnaireAnswer,
};
