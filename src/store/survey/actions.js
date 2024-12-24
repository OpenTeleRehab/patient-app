import {Survey} from '../../services/survey';
import {mutation} from './mutations';

export const getPublishSurvey = (payload) => async (dispatch) => {
  dispatch(mutation.publishSurveyfetchRequest());
  const data = await Survey.getPublishSurvey(payload);
  if (data) {
    dispatch(mutation.publishSurveyfetchSuccess(data.data));
  } else {
    dispatch(mutation.publishSurveyfetchFailure());
  }
};

export const submitSurvey = (payload, accessToken) => async (dispatch) => {
  dispatch(mutation.submitSurveyRequest());
  const data = await Survey.submitSurvey(payload, accessToken);
  if (data.success) {
    return {success: true};
  } else {
    dispatch(mutation.submitSurveyFailure());
    return {success: false, message: data.message};
  }
};

export const skipSurvey = (payload, accessToken) => async (dispatch) => {
  dispatch(mutation.skipSurveyRequest());
  const data = await Survey.skipSurvey(payload, accessToken);
  if (data.success) {
    return {success: true};
  } else {
    dispatch(mutation.skipSurveyFailure());
    return {success: false, message: data.message};
  }
};
