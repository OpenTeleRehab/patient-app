/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Language} from '../../services/language';
import {mutation} from './mutations';

export const getLanguageRequest = () => async (dispatch) => {
  dispatch(mutation.languageFetchRequest);
  const data = await Language.getLanguages();
  if (data.success) {
    dispatch(mutation.languageFetchSuccess(data.data));
  } else {
    dispatch(mutation.languageFetchFailure());
  }
};
