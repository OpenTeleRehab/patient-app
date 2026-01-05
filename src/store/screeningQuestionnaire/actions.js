import {ScreeningQuestionnaire} from '../../services/screeningQuestionnaire';
import {getCachedImage} from '../../utils/imageHelper';
import {mutation} from './mutations';

export const getScreeningQuestionnaireListRequest =
  (patientID) => async (dispatch, getState) => {
    dispatch(mutation.screeningQuestionnaireListFetchRequest());
    const {accessToken} = getState().user;
    const res = await ScreeningQuestionnaire.getScreeningQuestionnaireList(
      accessToken,
      {user_id: patientID},
    );
    if (res.success) {
      dispatch(
        mutation.screeningQuestionnaireListFetchSuccess(patientID, res.data),
      );
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

export const syncOfflineScreeningQuestionnaires =
  (offlineInterviews) => async (dispatch) => {
    const failedItems = [];
    const syncedPatientIds = new Set();

    for (const item of offlineInterviews) {
      try {
        await dispatch(
          submitScreeningQuestionnaireAnswerRequest(
            item.screeningQuestionnaireId,
            item.userId,
            item.answers,
          ),
        );

        syncedPatientIds.add(item.userId);
      } catch (e) {
        console.log('Failed to sync offline interview', e);
        failedItems.push(item); // keep failed items in offline queue
      }
    }

    dispatch(mutation.submitScreeningQuestionnaireOfflineSuccess(failedItems));

    // syncedPatientIds.forEach((patientId) => {
    //   dispatch(getScreeningQuestionnaireListRequest(patientId));
    // });
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
