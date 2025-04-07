import { initialState } from './states';

export const survey = (state = initialState, action) => {
  switch (action.type) {
    case 'PUBLISH_SURVEY_FETCH_SUCCESSED': {
      return Object.assign({}, state, {
        publishSurveys: action.data,
      });
    }
    default:
      return state;
  }
};
