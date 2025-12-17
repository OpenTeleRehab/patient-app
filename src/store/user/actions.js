/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {User} from '../../services/user';
import {mutation} from './mutations';
import settings from '../../../config/settings';
import moment from 'moment';
import _ from 'lodash';
import {storeLocalData} from '../../utils/local_storage';
import {STORAGE_KEY, USER_ROLE} from '../../variables/constants';
import {callApi, callTherapistApi} from '../../utils/request';
import RNLocalize from 'react-native-localize';

export const verifyPhoneNumberRequest =
  (to, code, email) => async (dispatch) => {
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

export const setupPinNumberRequest = (pin) => async (dispatch, getState) => {
  dispatch(mutation.userSetupPinNumberRequest());

  const {language} = getState().translation;
  const {dial_code, phone, email, password, countryCode, registerAs} =
    getState().register;

  let response;

  if (registerAs === USER_ROLE.HEALTH_WORKER) {
    const accessToken = getState().register.tempAccessToken;
    const result = await callTherapistApi('/user/profile', accessToken);

    if (result) {
      response = {
        success: true,
        data: {
          token: accessToken,
          profile: result.data,
        },
      };
    }
  } else {
    response = await User.setupPinNumber(
      pin,
      phone,
      getState().user.otpCode,
      getState().user.termOfService.id,
      getState().user.privacyPolicy.id,
      language,
      countryCode,
    );
  }

  if (response.success) {
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

    dispatch(
      mutation.userRegisterSuccess({
        dial_code,
        phone,
        email,
        password,
        countryCode,
        registerAs,
      }),
    );

    dispatch(mutation.userSetupPinNumberSuccess(pin));

    await storeLocalData(STORAGE_KEY.LANGUAGE, language);

    return response;
  } else {
    dispatch(mutation.userSetupPinNumberFailure());
    return {success: false};
  }
};

export const loginRequest = () => async (dispatch, getState) => {
  const registerAs = getState().user.registerAs;
  const phone = getState().user.phone;
  const pin = getState().user.pin;

  dispatch(mutation.userLoginRequest());

  let response;

  if (registerAs === USER_ROLE.HEALTH_WORKER) {
    const {email, password} = getState().user;

    const body = {email, password};

    response = await callTherapistApi('/auth/login', '', body, 'post');
  } else {
    const timezone = RNLocalize.getTimeZone();
    const countryCode = getState().user.countryCode;
    const body = {phone, pin, timezone};

    response = await callApi('/auth/login', '', body, 'post', false, {
      country: countryCode,
    });
  }

  if (response.success) {
    if (registerAs === USER_ROLE.HEALTH_WORKER) {
      dispatch(
        mutation.userRegisterSuccess({
          accessToken: response.data.access_token,
        }),
      );

      return {
        success: true,
        acceptedTermOfService: true,
        acceptedPrivacyPolicy: true,
      };
    } else {
      const {
        term_and_condition_id: currentAcceptedTermId,
        privacy_and_policy_id: currentAcceptedPolicyId,
      } = response.data.profile;

      const latestTerm = getState().user.termOfService;
      const latestPolicy = getState().user.privacyPolicy;

      const acceptedTerm =
        _.isEmpty(latestTerm) || latestTerm.id === currentAcceptedTermId;
      const acceptedPolicy =
        _.isEmpty(latestPolicy) || latestPolicy?.id === currentAcceptedPolicyId;

      if (!acceptedTerm || !acceptedPolicy) {
        response.data.token = '';
      }

      dispatch(mutation.userLoginSuccess(response.data, phone, pin));

      return {success: true, acceptedTerm, acceptedPolicy};
    }
  } else {
    dispatch(mutation.userLoginFailure());
    return {success: false};
  }
};

export const logoutRequest = () => async (dispatch) => {
  dispatch(mutation.userLogoutSuccess());
};

export const comparePinNumberRequest =
  (pin, accessToken) => async (dispatch) => {
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

export const changePinNumberRequest = (pin) => async (dispatch, getState) => {
  const {accessToken, registerAs} = getState().user;

  dispatch(mutation.userChangePinNumberRequest());

  if (registerAs === USER_ROLE.HEALTH_WORKER) {
    dispatch(mutation.userChangePinNumberSuccess({pin}));
    return {success: true};
  } else {
    const data = await User.changePinNumber(pin, accessToken);
    if (data.success) {
      dispatch(
        mutation.userChangePinNumberSuccess({
          accessToken: data.data.token,
          pin: pin,
        }),
      );
      return {success: true};
    } else {
      dispatch(mutation.userChangePinNumberFailure());
      return {success: false};
    }
  }
};

export const changePasswordRequest =
  (payload) => async (dispatch, getState) => {
    const {accessToken} = getState().user;
    dispatch(mutation.userChangePasswordRequest());
    const data = await User.changePassword(payload, accessToken);
    if (data.success) {
      dispatch(mutation.userChangePasswordSuccess(payload.new_password));
      return {success: true};
    } else {
      dispatch(mutation.userChangePasswordFailure());
      return {success: false};
    }
  };

export const setInitialRouteName = (routeName) => async (dispatch) => {
  dispatch(mutation.userSetInitialRouteNameSuccess(routeName));
};

export const setProfileInfo = (data) => async (dispatch) => {
  dispatch(mutation.userSetProfileSuccess(data));
};

export const updateProfileRequest = (payload) => async (dispatch, getState) => {
  const {accessToken} = getState().user;
  let data = await User.updateProfile(payload, accessToken);
  if (data.success) {
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

export const acceptTermOfServiceRequest =
  (id) => async (dispatch, getState) => {
    dispatch(mutation.acceptTermOfServiceRequest());
    let data = await User.acceptTermOfService(
      id,
      getState().user.profile.token,
    );
    if (data.success) {
      dispatch(mutation.acceptTermOfServiceSuccess(data.data));
      return true;
    } else {
      dispatch(mutation.acceptTermOfServiceFailure());
      return false;
    }
  };

export const acceptPrivacyPolicyRequest =
  (id) => async (dispatch, getState) => {
    dispatch(mutation.acceptPrivacyPolicyRequest());
    let data = await User.acceptPrivacyPolicy(
      id,
      getState().user.profile.token,
    );
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

export const createFirebaseToken =
  (accessToken, payload) => async (dispatch) => {
    dispatch(mutation.userCreateFirebaseTokenRequest());

    let data = await User.createFirebaseToken(accessToken, payload);

    if (data.success) {
      dispatch(mutation.userCreateFirebaseTokenSuccess(data.data));
    } else {
      dispatch(mutation.userCreateFirebaseTokenFailure());
    }
  };

export const forgotPasswordRequest = (email) => async () => {
  const body = {email};
  const response = await callTherapistApi(
    '/auth/forgot-password',
    '',
    body,
    'post',
  );
  return response;
};
