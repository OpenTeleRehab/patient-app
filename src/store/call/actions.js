/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
import {mutation} from './mutations';

export const acceptedRequest = (data) => async (dispatch) => {
  dispatch(mutation.accepted(data));
};

export const rejectedRequest = (data) => async (dispatch) => {
  dispatch(mutation.rejected(data));
};
