/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {User} from '../../services/user';
import {mutation} from './mutations';
import settings from '../../../config/settings';
import moment from 'moment';
import {storeLocalData} from '../../utils/local_storage';
import {STORAGE_KEY} from '../../variables/constants';
import RNLocalize from 'react-native-localize';

export const registerRequest = (dialCode, to, hash, country, email) => async (
  dispatch,
) => {
  dispatch(mutation.userRegisterRequest());
  const data = await User.register(to, hash, country, email);
  if (data.success) {
    dispatch(mutation.userRegisterSuccess({dialCode, to, country}));
    return true;
  } else {
    dispatch(mutation.userRegisterFailure());
    return false;
  }
};

export const verifyPhoneNumberRequest = (to, code, email) => async (
  dispatch,
) => {
  dispatch(mutation.userVerifyPhoneNumberRequest());
  const data = await User.verifyPhoneNumber(to, code, email);
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
  getState,
) => {
  dispatch(mutation.userSetupPinNumberRequest());
  const {language} = getState().translation;
  const {countryCode} = getState().user;
  const data = await User.setupPinNumber(
    pin,
    phone,
    otp_code,
    getState().user.termOfService.id,
    getState().user.privacyPolicy.id,
    language,
    countryCode,
  );
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
        country: countryCode,
      },
      true,
    );
    dispatch(mutation.userSetupPinNumberSuccess(pin));
    await storeLocalData(STORAGE_KEY.LANGUAGE, language);
    return {success: true, data: data.data};
  } else {
    dispatch(mutation.userSetupPinNumberFailure());
    return {success: false};
  }
};

export const loginRequest = (phone, pin, countryCode) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.userLoginRequest());
  let data = await User.login(
    phone,
    pin,
    RNLocalize.getTimeZone(),
    countryCode,
  );
  if (data.success) {
    let acceptedTermOfService = true;
    let acceptedPrivacyPolicy = true;
    if (
      data.data.profile.term_and_condition_id !==
        getState().user.termOfService.id ||
      data.data.profile.privacy_and_policy_id !==
        getState().user.privacyPolicy.id
    ) {
      data.data.profile.token = data.data.token;
      data.data.token = '';
      acceptedTermOfService = false;
      acceptedPrivacyPolicy = false;
    }
    dispatch(mutation.userLoginSuccess(data.data, phone, pin));
    return {success: true, acceptedTermOfService, acceptedPrivacyPolicy};
  } else {
    dispatch(mutation.userLoginFailure());
    return {success: false};
  }
};

export const logoutRequest = (accessToken) => async (dispatch) => {
  dispatch(mutation.userLogoutSuccess());
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

export const updateProfileRequest = (id, payload, phone, therapistId) => async (
  dispatch,
) => {
  let data = await User.updateProfile(id, payload);
  if (data.success) {
    payload.phone = phone;
    payload.therapist_id = therapistId;
    dispatch(mutation.updateProfileSuccess(payload));
    return true;
  } else {
    dispatch(mutation.updateProfileFailure());
    return false;
  }
};

export const deleteProfileRequest = () => async (dispatch, getState) => {
  const {accessToken} = getState().user;
  const res = await User.deleteProfile(accessToken);
  if (res.success) {
    dispatch(mutation.deleteProfileSuccess());
    return true;
  } else {
    dispatch(mutation.deleteProfileFailure());
    return false;
  }
};

export const fetchTermOfServiceRequest = () => async (dispatch, getState) => {
  const {language} = getState().translation;
  let res = await User.getTermOfService(language);
  if (res && res.data) {
    dispatch(mutation.fetchTermOfServiceSuccess(res.data));
    return true;
  } else {
    dispatch(mutation.fetchTermOfServiceFailure());
    return false;
  }
};

export const fetchPrivacyPolicyRequest = () => async (dispatch, getState) => {
  const {language} = getState().translation;
  let res = await User.getPrivacyPolicy(language);
  if (res && res.data) {
    dispatch(mutation.fetchPrivacyPolicySuccess(res.data));
    return true;
  } else {
    dispatch(mutation.fetchPrivacyPolicyFailure());
    return false;
  }
};

export const acceptTermOfServiceRequest = (id) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.acceptTermOfServiceRequest());
  let data = await User.acceptTermOfService(id, getState().user.profile.token);
  if (data.success) {
    dispatch(mutation.acceptTermOfServiceSuccess(data.data));
    return true;
  } else {
    dispatch(mutation.acceptTermOfServiceFailure());
    return false;
  }
};

export const acceptPrivacyPolicyRequest = (id) => async (
  dispatch,
  getState,
) => {
  dispatch(mutation.acceptPrivacyPolicyRequest());
  let data = await User.acceptPrivacyPolicy(id, getState().user.profile.token);
  if (data.success) {
    dispatch(mutation.acceptPrivacyPolicySuccess(data.data));
    return true;
  } else {
    dispatch(mutation.acceptPrivacyPolicyFailure());
    return false;
  }
};

export const generateFakeAccessToken = () => async (dispatch) => {
  dispatch(mutation.generateFakeAccessTokenSuccess());
};

export const enableKidTheme = (accessToken, payload) => async (dispatch) => {
  dispatch(mutation.enableKidThemeRequest());
  let data = await User.enableKidTheme(accessToken, payload);
  if (data.success) {
    dispatch(mutation.enableKidThemeSuccess(data.data));
    return true;
  } else {
    dispatch(mutation.enableKidThemeFailure());
    return false;
  }
};
