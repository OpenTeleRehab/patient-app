/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const translationFetchSuccess = (language, rtl) => {
  return {
    type: 'TRANSLATION_FETCH_SUCCEED',
    language,
    rtl: rtl,
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
