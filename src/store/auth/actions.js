/*
 * This file is an extension of /store/user/actions.
 * It's created to avoid Require Cycles warning.
 */

import {mutation} from '../user/mutations';

export const forceLogout = () => async (dispatch) => {
  dispatch(mutation.userLogoutSuccess());
};
