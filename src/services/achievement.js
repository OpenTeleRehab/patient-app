/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getAchievements = async (accessToken) => {
  return await callApi('/achievement/get-patient-achievements', accessToken);
};

export const Achievement = {
  getAchievements,
};
