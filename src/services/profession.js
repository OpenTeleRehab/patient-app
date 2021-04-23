/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {callAdminApi} from '../utils/request';

const getProfessions = async (countryId) => {
  return await callAdminApi('/profession', {country_id: countryId});
};

export const Profession = {
  getProfessions,
};
