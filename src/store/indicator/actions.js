/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {mutation} from './mutations';

export const loadIndicatorList = () => (dispatch) => {
  dispatch(mutation.indicatorLoadSuccess());
};

export const updateIndicatorList = (payload) => (dispatch) => {
  dispatch(mutation.indicatorUpdateSuccess(payload));
};
