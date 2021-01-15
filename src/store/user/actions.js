/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {User} from '../../services/user';
import {mutation} from './mutations';
import settings from '../../../config/settings';
import moment from 'moment';
import {storeLocalData} from '../../utils/local_storage';
import {ROUTES, STORAGE_KEY} from '../../variables/constants';

export const registerRequest = (to) => async (dispatch) => {
  dispatch(mutation.userRegisterRequest());
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
  dispatch(mutation.userVerifyPhoneNumberRequest());
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
  dispatch(mutation.userSetupPinNumberRequest());
  const data = await User.setupPinNumber(pin, phone, otp_code);
  if (data.success) {
    const timespan = moment()
      .add(1, 'M')
      .format(settings.format.date)
      .toString();
    await storeLocalData(
      STORAGE_KEY.AUTH_INFO,
      {
        phone,
        timespan,
      },
      true,
    );
    dispatch(mutation.userSetupPinNumberSuccess());
    return {success: true, data: data.data};
  } else {
    dispatch(mutation.userSetupPinNumberFailure());
    return {success: false};
  }
};

export const loginRequest = (phone, pin) => async (dispatch) => {
  dispatch(mutation.userLoginRequest());
  const data = await User.login(phone, pin);
  if (data.success) {
    dispatch(mutation.userLoginSuccess(data.data));
    return true;
  } else {
    dispatch(mutation.userLoginFailure());
    return false;
  }
};

export const logoutRequest = (accessToken) => async (dispatch) => {
  const data = await User.logout(accessToken);
  if (data.success) {
    dispatch(mutation.userLogoutSuccess());
    dispatch(mutation.userSetInitialRouteNameSuccess(ROUTES.LOGIN));
    return true;
  } else {
    dispatch(mutation.userLogoutFailure());
    return false;
  }
};

export const comparePinNumberRequest = (pin, accessToken) => async (
  dispatch,
) => {
  dispatch(mutation.userComparePinNumberRequest());
  const data = await User.comparePinNumber(pin, accessToken);
  if (data.success) {
    dispatch(mutation.userComparePinNumberSuccess());
    return true;
  } else {
    dispatch(mutation.userComparePinNumberFailure());
    return false;
  }
};

export const changePinNumberRequest = (pin, phone, accessToken) => async (
  dispatch,
) => {
  dispatch(mutation.userChangePinNumberRequest());
  const data = await User.changePinNumber(pin, accessToken);
  if (data.success) {
    const timespan = moment()
      .add(1, 'M')
      .format(settings.format.date)
      .toString();
    await storeLocalData(
      STORAGE_KEY.AUTH_INFO,
      {
        phone,
        timespan,
      },
      true,
    );
    dispatch(mutation.userChangePinNumberSuccess(data.data));
    return {success: true, data: data.data};
  } else {
    dispatch(mutation.userChangePinNumberFailure());
    return {success: false};
  }
};

export const setInitialRouteName = (routeName) => async (dispatch) => {
  dispatch(mutation.userSetInitialRouteNameSuccess(routeName));
};

export const setProfileInfo = (data) => async (dispatch) => {
  dispatch(mutation.userSetProfileSuccess(data));
};

export const updateProfileRequest = (id, payload, phone) => async (
  dispatch,
) => {
  let data = await User.updateProfile(id, payload);
  if (data.success) {
    payload.phone = phone;
    dispatch(mutation.updateProfileSuccess(payload));
    return true;
  } else {
    dispatch(mutation.updateProfileFailure());
    return false;
  }
};

export const fetchTermOfServiceRequest = () => async (dispatch) => {
  let res = await User.getTermOfService();
  if (res && res.data) {
    dispatch(mutation.fetchTermOfServiceSuccess(res.data));
    return true;
  } else {
    dispatch(mutation.fetchTermOfServiceFailure());
    return false;
  }
};

export const acceptTermOfServiceRequest = (id, accessToken) => async (
  dispatch,
) => {
  dispatch(mutation.acceptTermOfServiceRequest());
  let data = await User.acceptTermOfService(id, accessToken);
  if (data.success) {
    dispatch(mutation.acceptTermOfServiceSuccess(data.data));
    return true;
  } else {
    dispatch(mutation.acceptTermOfServiceFailure());
    return false;
  }
};
