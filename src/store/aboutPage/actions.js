/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {AboutPage} from '../../services/aboutPage';
import {mutation} from './mutations';

export const getAboutPageRequest = () => async (dispatch, getState) => {
  dispatch(mutation.aboutPageFetchRequest());
  const {language} = getState().translation;
  const data = await AboutPage.getAboutPage(language);
  if (data && data.data) {
    dispatch(mutation.aboutPageFetchSuccess(data.data));
  } else {
    dispatch(mutation.aboutPageFetchFailure());
  }
};
