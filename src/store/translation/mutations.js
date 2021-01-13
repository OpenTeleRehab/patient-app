/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const translationFetchSuccess = () => {
  return {
    type: 'TRANSLATION_FETCH_SUCCEED',
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
