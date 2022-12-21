/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {AssistiveTechnology} from '../../services/assistiveTechnology';
import {mutation} from './mutations';

export const getAssistiveTechnologiesRequest = () => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.assistiveTechnologiesFetchRequest());
  const {language} = getState().translation;
  const data = await AssistiveTechnology.getAssistiveTechnologies(language);
  if (data.success) {
    dispatch(mutation.assistiveTechnologiesFetchSuccess(data.data));
  } else {
    dispatch(mutation.assistiveTechnologiesFetchFailure());
  }
};
