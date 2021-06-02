/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {StaticPage} from '../../services/staticPage';
import {mutation} from './mutations';

export const getAboutPageRequest = () => async (dispatch, getState) => {
  dispatch(mutation.aboutPageFetchRequest());
  const {language} = getState().translation;
  const data = await StaticPage.getAboutPage(language);
  if (data && data.data) {
    dispatch(mutation.aboutPageFetchSuccess(data.data));
  } else {
    dispatch(mutation.aboutPageFetchFailure());
  }
};

export const getFaqPageRequest = () => async (dispatch, getState) => {
  dispatch(mutation.faqPageFetchRequest());
  const {language} = getState().translation;
  const data = await StaticPage.getFaqPage(language);
  if (data && data.data) {
    dispatch(mutation.faqPageFetchSuccess(data.data));
  } else {
    dispatch(mutation.faqPageFetchFailure());
  }
};
