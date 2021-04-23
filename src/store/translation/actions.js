/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {addTranslationForLanguage} from 'react-localize-redux';
import {Translation} from '../../services/translation';
import {mutation} from './mutations';
import {storeLocalData} from '../../utils/local_storage';
import {STORAGE_KEY} from '../../variables/constants';
import {Language} from '../../services/language';

export const getTranslations = (lang) => async (dispatch) => {
  const data = await Translation.getTranslations(lang);

  let isRtl = undefined;
  const language = await Language.getLanguageById(lang);
  if (lang != null && language && language.data) {
    isRtl = !!language.data['rtl'];
  }

  if (data && data.data) {
    const messages = {};
    data.data.map((m) => {
      messages[m.key] = m.value;
      return true;
    });
    storeLocalData(
      STORAGE_KEY.TRANSLATE,
      {
        powered_by: messages['common.powered_by'] || 'Powered by',
        supported_by: messages['common.supported_by'] || 'Supported by',
      },
      true,
    );
    dispatch(addTranslationForLanguage(messages, 'en'));
    dispatch(mutation.translationFetchSuccess(lang, isRtl));
    return true;
  }
  dispatch(mutation.translationFetchFailure());
  return false;
};
