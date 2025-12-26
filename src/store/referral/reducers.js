import {initialState} from './states';
export const referral = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_REFERRAL_FETCH_REQUESTED':
      return {
        ...state,
        loading: true,
      };
    case 'CREATE_REFERRAL_FETCH_SUCCEEDED':
      return {
        ...state,
        loading: false,
      };
    case 'CREATE_REFERRAL_FETCH_FAILED':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
