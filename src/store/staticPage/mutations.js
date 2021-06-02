/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const aboutPageFetchRequest = () => {
  return {
    type: 'ABOUT_PAGE_FETCH_REQUESTED',
  };
};
const aboutPageFetchSuccess = (data) => {
  return {
    type: 'ABOUT_PAGE_FETCH_SUCCEED',
    data,
  };
};

const aboutPageFetchFailure = () => {
  return {
    type: 'ABOUT_PAGE_FETCH_FAILED',
  };
};

const faqPageFetchRequest = () => {
  return {
    type: 'FAQ_PAGE_FETCH_REQUESTED',
  };
};
const faqPageFetchSuccess = (data) => {
  return {
    type: 'FAQ_PAGE_FETCH_SUCCEED',
    data,
  };
};

const faqPageFetchFailure = () => {
  return {
    type: 'FAQ_PAGE_FETCH_FAILED',
  };
};

export const mutation = {
  aboutPageFetchRequest,
  aboutPageFetchSuccess,
  aboutPageFetchFailure,
  faqPageFetchFailure,
  faqPageFetchSuccess,
  faqPageFetchRequest,
};
