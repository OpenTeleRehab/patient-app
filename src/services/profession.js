/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callApi} from '../utils/request';

const getProfessions = async (countryId, accessToken) => {
  return await callApi('/profession', accessToken, {country_id: countryId});
};

export const Profession = {
  getProfessions,
};
