import {callApi} from '../utils/request';

const getScreeningQuestionnaireList = async (accessToken, {user_id}) => {
  return await callApi('/screening-questionnaires-list', accessToken, {
    user_id,
  });
};

const getScreeningQuestionnaireHistroyList = async (
  accessToken,
  {user_id, questionnaire_id},
) => {
  return await callApi('/screening-questionnaires-history-list', accessToken, {
    user_id,
    questionnaire_id,
  });
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
  getScreeningQuestionnaireHistroyList,
  submitScreeningQuestionnaireAnswer,
};
