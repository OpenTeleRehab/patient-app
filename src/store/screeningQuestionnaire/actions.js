import {ScreeningQuestionnaire} from '../../services/screeningQuestionnaire';
import {getCachedImage} from '../../utils/imageHelper';
import {OFFLINE_STATUS} from '../../variables/constants';
import {mutation} from './mutations';

export const getScreeningQuestionnaireListRequest =
  () => async (dispatch, getState) => {
    dispatch(mutation.screeningQuestionnaireListFetchRequest());
    const {accessToken} = getState().user;
    const res = await ScreeningQuestionnaire.getScreeningQuestionnaireList(
      accessToken,
    );
    if (res.success) {
      dispatch(mutation.screeningQuestionnaireListFetchSuccess(res.data));
      for (const questionnaire of res.data) {
        for (const section of questionnaire.sections) {
          for (const question of section.questions) {
            if (question.file) {
              getCachedImage(question.file);
            }
            for (const option of question.options || []) {
              if (option.file) {
                getCachedImage(option.file);
              }
            }
          }
        }
      }
    } else {
      dispatch(mutation.screeningQuestionnaireListFetchFailure());
    }
  };

export const submitScreeningQuestionnaireAnswerRequest =
  (screeningQuestionnaireId, userId, answers) => async (dispatch, getState) => {
    dispatch(mutation.submitScreeningQuestionnaireRequest());
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('answers', JSON.stringify(answers));
    const {accessToken} = getState().user;

    const res = await ScreeningQuestionnaire.submitScreeningQuestionnaireAnswer(
      screeningQuestionnaireId,
      formData,
      accessToken,
    );
    // Reset loading, otherwise screens relying on it (e.g. history list) stay empty
    if (res?.success) {
      dispatch(mutation.submitScreeningQuestionnaireSuccess());
    } else {
      dispatch(mutation.submitScreeningQuestionnaireFailure());
    }
    return res;
  };

export const syncOfflineScreeningQuestionnaires =
  (offlineInterviews) => async (dispatch, getState) => {
    const syncedItems = [];

    for (const item of offlineInterviews) {
      if (item.status === OFFLINE_STATUS.USER_DUPLICATE) {
        continue;
      }
      try {
        const res = await dispatch(
          submitScreeningQuestionnaireAnswerRequest(
            item.questionnaire_id,
            item.userId,
            item.answers,
          ),
        );
        // callApi resolves with {} or {success: false} on failure instead of throwing
        if (res?.success) {
          syncedItems.push(item);
        }
      } catch (e) {
        console.log('Failed to sync offline interview', e);
      }
    }

    // Reload the history of synced interviews before they leave the offline queue,
    // without toggling loading, so the history list neither blinks nor loses them
    const {accessToken} = getState().user;
    const syncedHistories = new Map(
      syncedItems.map((item) => [
        `${item.userId}_${item.questionnaire_id}`,
        item,
      ]),
    );
    const histories = await Promise.all(
      [...syncedHistories.values()].map(async ({userId, questionnaire_id}) => ({
        userId,
        questionnaire_id,
        res: await ScreeningQuestionnaire.getScreeningQuestionnaireHistroyList(
          accessToken,
          {user_id: userId, questionnaire_id},
        ),
      })),
    );
    for (const {userId, questionnaire_id, res} of histories) {
      if (res?.success) {
        dispatch(
          mutation.screeningQuestionnaireHistoryListFetchSuccess(
            userId,
            questionnaire_id,
            res.data,
          ),
        );
      }
    }

    // Remove only synced items so failed ones and ones added meanwhile stay queued
    const {offlineInterviews: current} = getState().screeningQuestionnaire;
    dispatch(
      mutation.submitScreeningQuestionnaireOfflineSuccess(
        current.filter(
          (interview) =>
            !syncedItems.some(
              (synced) =>
                synced.questionnaire_id === interview.questionnaire_id &&
                synced.answers === interview.answers,
            ),
        ),
      ),
    );
  };

// Offline Submit Screening Questionnaries
export const submitScreeningQuestionnaireAnswerOffline =
  (data) => async (dispatch, getState) => {
    const {offlineInterviews} = getState().screeningQuestionnaire;
    let updatedOfflineInterviews;
    if (offlineInterviews?.length > 0) {
      updatedOfflineInterviews = [...offlineInterviews, data];
    } else {
      updatedOfflineInterviews = [data];
    }
    dispatch(
      mutation.submitScreeningQuestionnaireOfflineSuccess(
        updatedOfflineInterviews,
      ),
    );
    // dispatch(mutation.submitScreeningQuestionnaireOfflineSuccess([]));
  };

export const getScreeningQuestionnaireHistoryListRequest =
  (userId, questionnaireId) => async (dispatch, getState) => {
    dispatch(mutation.screeningQuestionnaireHistoryListFetchRequest());
    const {accessToken} = getState().user;
    const res =
      await ScreeningQuestionnaire.getScreeningQuestionnaireHistroyList(
        accessToken,
        {user_id: userId, questionnaire_id: questionnaireId},
      );
    if (res.success) {
      dispatch(
        mutation.screeningQuestionnaireHistoryListFetchSuccess(
          userId,
          questionnaireId,
          res.data,
        ),
      );
    } else {
      dispatch(mutation.screeningQuestionnaireHistoryListFetchFailure());
    }
  };
