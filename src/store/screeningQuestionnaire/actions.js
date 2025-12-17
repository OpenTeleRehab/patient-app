import {ScreeningQuestionnaire} from '../../services/screeningQuestionnaire';
import {mutation} from './mutations';

export const getScreeningQuestionnarieListRequest =
  () => async (dispatch, getState) => {
    dispatch(mutation.screeningQuestionnaireListFetchRequest());
    const {accessToken} = getState().user;
    const res = await ScreeningQuestionnaire.getScreeningQuestionnaireList(
      accessToken,
    );
    if (res.success) {
      dispatch(mutation.screeningQuestionnaireListFetchSuccess(res.data));
    } else {
      dispatch(mutation.screeningQuestionnaireListFetchFailure());
    }
  };

export const submitScreeningQuestionnaireAnswerRequest =
  (screeningQuestionnaireId, userId, answers) => async (dispatch, getState) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('answers', JSON.stringify(answers));
    const {accessToken} = getState().user;

    return ScreeningQuestionnaire.submitScreeningQuestionnaireAnswer(
      screeningQuestionnaireId,
      formData,
      accessToken,
    );
  };
