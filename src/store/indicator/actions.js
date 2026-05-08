/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {mutation} from './mutations';

export const updateIndicatorList = (payload) => (dispatch) => {
  dispatch(mutation.indicatorUpdateSuccess(payload));
};
