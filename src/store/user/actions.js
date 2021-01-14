/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {User} from '../../services/user';
import {mutation} from './mutations';
import settings from '../../../config/settings';
import moment from 'moment';
import {storeLocalData} from '../../utils/local_storage';

export const registerRequest = (to) => async (dispatch) => {
  const data = await User.register(to);
  if (data.success) {
    dispatch(mutation.userRegisterSuccess({to}));
    return true;
  } else {
    dispatch(mutation.userRegisterFailure());
    return false;
  }
};

export const verifyPhoneNumberRequest = (to, code) => async (dispatch) => {
  const data = await User.verifyPhoneNumber(to, code);
  if (data.success) {
    dispatch(mutation.userVerifyPhoneNumberSuccess({code}));
    return true;
  } else {
    dispatch(mutation.userVerifyPhoneNumberFailure());
    return false;
  }
};

export const setupPinNumberRequest = (pin, phone, otp_code) => async (
  dispatch,
) => {
  const data = await User.setupPinNumber(pin, phone, otp_code);
  if (data.success) {
    const timespan = moment()
      .add(1, 'M')
      .format(settings.format.date)
      .toString();
    await storeLocalData(
      'OrgHiPatientApp',
      {
        phone,
        timespan,
      },
      true,
    );
    dispatch(mutation.userSetupPinNumberSuccess(data.data));
    return true;
  } else {
    dispatch(mutation.userSetupPinNumberFailure());
    return false;
  }
};

export const loginRequest = (phone, pin) => async (dispatch) => {
  const data = await User.login(phone, pin);
  if (data.success) {
    dispatch(mutation.userLoginSuccess(data.data));
    return true;
  } else {
    dispatch(mutation.userLoginFailure());
    return false;
  }
};

export const logoutRequest = () => async (dispatch) => {
  const data = await User.logout();
  if (data) {
    dispatch(mutation.userLogoutSuccess());
  } else {
    dispatch(mutation.userLogoutFailure());
  }
};

export const setInitialRouteName = (routeName) => async (dispatch) => {
  dispatch(mutation.userSetInitialRouteNameSuccess(routeName));
};
