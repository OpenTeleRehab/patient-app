/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const assistiveTechnologiesFetchRequest = () => {
  return {
    type: 'ASSISTIVE_TECHNOLOGIES_FETCH_REQUESTED',
  };
};
const assistiveTechnologiesFetchSuccess = (data) => {
  return {
    type: 'ASSISTIVE_TECHNOLOGIES_FETCH_SUCCEED',
    data,
  };
};

const assistiveTechnologiesFetchFailure = () => {
  return {
    type: 'ASSISTIVE_TECHNOLOGIES_FETCH_FAILED',
  };
};

export const mutation = {
  assistiveTechnologiesFetchRequest,
  assistiveTechnologiesFetchSuccess,
  assistiveTechnologiesFetchFailure,
};
