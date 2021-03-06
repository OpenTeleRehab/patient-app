/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const translationFetchSuccess = (messages, language) => {
  return {
    type: 'TRANSLATION_FETCH_SUCCEED',
    messages,
    language,
  };
};

const translationFetchFailure = () => {
  return {
    type: 'TRANSLATION_FETCH_FAILED',
  };
};

export const mutation = {
  translationFetchSuccess,
  translationFetchFailure,
};
