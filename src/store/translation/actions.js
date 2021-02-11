/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {addTranslationForLanguage} from 'react-localize-redux';
import {Translation} from '../../services/translation';
import {mutation} from './mutations';

export const getTranslations = (lang) => async (dispatch) => {
  const data = await Translation.getTranslations(lang);
  if (data && data.data) {
    const messages = {};
    data.data.map((m) => {
      messages[m.key] = m.value;
      return true;
    });
    dispatch(addTranslationForLanguage(messages, 'en'));
    dispatch(mutation.translationFetchSuccess());
    return true;
  }
  dispatch(mutation.translationFetchFailure());
  return false;
};
