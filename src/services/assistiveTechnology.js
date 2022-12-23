/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getAssistiveTechnologies = async (lang) => {
  return await callAdminApi('/assistive-technologies', {lang});
};

export const AssistiveTechnology = {
  getAssistiveTechnologies,
};
