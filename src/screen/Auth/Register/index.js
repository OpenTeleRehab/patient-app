/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  View,
  Platform,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  ButtonGroup,
  Input,
  Text,
  withTheme,
} from 'react-native-elements';
import { getTranslate } from 'react-localize-redux';
import _ from 'lodash';
import styles from '../../../assets/styles';

import { registerRequest } from '../../../store/register/actions';
import {
  getCountryRequest,
  getDefinedCountries,
} from '../../../store/country/actions';
import { getLanguageRequest } from '../../../store/language/actions';
import { getTranslations } from '../../../store/translation/actions';
import { getPhoneRequest } from '../../../store/phone/actions';
import SelectPicker from '../../../components/Common/SelectPicker';
import HeaderBar from '../../../components/Common/HeaderBar';
import { Country } from '../../../services/country';
import { ROUTES, USER_ROLE } from '../../../variables/constants';
import TextField from '../../../components/Common/TextField';
import validateEmail from '../../../utils/validateEmail';

let RNOtpVerify;

if (Platform.OS === 'android') {
  RNOtpVerify = require('@webessentials/react-native-otp-verify').default;
}

const phoneCodeContainerStyle = {
  width: '35%',
  marginRight: 5,
  height: '60%',
};
const phoneContainerStyle = {
  width: '65%',
  height: '60%',
};

const inputPhoneContainerStyle = {
  borderBottomWidth: 0,
};

const contentContainer = {
  height: '100%',
};

const Register = ({ theme, navigation, route }) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const { profile } = useSelector((state) => state.user);
  const { definedCountries, userCountryCode } = useSelector(
    (state) => state.country,
  );
  const [registerAsSelectedIndex, setRegisterAsSelectedIndex] = useState(route?.params?.registerIndexTab ?? 0);
  const {languages} = useSelector((state) => state.language);
  const [hash, setHash] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryPhoneCode, setCountryPhoneCode] = useState('');
  const [countryIsoCode, setCountryIsoCode] = useState('');
  const [language, setLanguage] = useState('');
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const shouldRegister = registerAsSelectedIndex === 0
    ? phoneNumber
    : email && password;

  const validateAndSetLanguage = useCallback(
    (lang) => {
      let languageId = lang;
      if (!languageId) {
        languageId = languages.length > 0 ? languages[0].id : '';
      }
      setLanguage(languageId);
    },
    [languages],
  );

  useEffect(() => {
    if (RNOtpVerify && hash === '') {
      RNOtpVerify.getHash().then((code) => {
        setHash(code);
      });
    }
  }, [hash]);

  useEffect(() => {
    dispatch(getDefinedCountries());
    dispatch(getLanguageRequest());
  }, [dispatch]);

  // Set default selected phone code
  useEffect(() => {
    if (definedCountries.length) {
      let defaultCountry = definedCountries[0];

      if (userCountryCode) {
        const userCountry = _.find(definedCountries, {
          iso_code: userCountryCode,
        });
        if (userCountry) {
          defaultCountry = userCountry;
        }
      }

      setCountryPhoneCode(defaultCountry.phone_code);
      validateAndSetLanguage(defaultCountry.language_id);
    }
  }, [definedCountries, userCountryCode, dispatch, validateAndSetLanguage]);

  const handleCountryCodeChange = (isoCode) => {
    const selectedCountry = _.find(definedCountries, { iso_code: isoCode });
    setCountryPhoneCode(selectedCountry?.phone_code);
    setCountryIsoCode(isoCode);
    validateAndSetLanguage(selectedCountry?.language_id);
  };

  const handleLanguageChange = (lang) => {
    validateAndSetLanguage(lang);
    dispatch(getTranslations(lang));
  };

  const handleRegister = () => {
    setErrorPhoneNumber(false);
    setErrorEmail(false);
    setErrorPassword(false);

    if (registerAsSelectedIndex === 0) {
      setErrorPhoneNumber(false);

      let mobileNumber = '';

      if (phoneNumber.startsWith(countryPhoneCode)) {
        mobileNumber = phoneNumber.replace(countryPhoneCode, '');
      } else {
        mobileNumber = phoneNumber;
      }

      const formattedNumber = countryPhoneCode + parseInt(mobileNumber, 10);

      dispatch(getPhoneRequest({ phone: formattedNumber })).then((phone) => {
        if (phone) {
          dispatch(getCountryRequest());

          Country.getCountryCodeByClinicId({clinic_id: phone.clinic_id, service_type: phone.service_type}).then((res) => {
            if (res.success) {
              dispatch(
                registerRequest(
                  countryPhoneCode,
                  formattedNumber,
                  hash,
                  res.data.iso_code,
                  '',
                  '',
                  USER_ROLE.PATIENT,
                ),
              ).then((result) => {
                if (result) {
                  navigation.navigate(ROUTES.VERIFY_PHONE);
                } else {
                  setErrorPhoneNumber(true);
                }
              });
            }
          }).catch((err) => {
            console.error(err);
          });
        } else {
          setErrorPhoneNumber(true);
        }
      });
    }

    if (registerAsSelectedIndex === 1) {
      let canRegister = true;

      if (!validateEmail(email)) {
        setErrorEmail(true);
        canRegister = false;
      } else {
        setErrorEmail(false);
      }

      if (password === '') {
        setErrorPassword(true);
        canRegister = false;
      } else {
        setErrorPassword(false);
      }

      if (canRegister) {
        dispatch(registerRequest('', '', '', '', email, password, USER_ROLE.HEALTH_WORKER)).then((res) => {
          if (res) {
            navigation.navigate(ROUTES.TERM_OF_SERVICE);
          } else {
            Alert.alert(
              translate('common.register').toString(),
              translate('error.message.register').toString(),
              [
                {
                  text: translate('common.ok').toString(),
                },
              ],
            );
          }
        });
      }
    }
  };

  return (
    <SafeAreaView>
      <HeaderBar
        backgroundPrimary
        onGoBack={
          _.isEmpty(profile)
            ? undefined
            : () => navigation.goBack()
        }
        title={translate('common.register')}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={[styles.mainContainerLight, contentContainer]}
      >
        <View style={styles.paddingMd}>
          <View style={styles.marginBottom}>
            <Text accessibilityLabel={translate('register.as.label')}>
              {translate('register.as.label')}
            </Text>
            <ButtonGroup
              buttons={[
                translate('register.as.patient'),
                translate('register.as.health_worker'),
              ]}
              selectedIndex={registerAsSelectedIndex}
              innerBorderStyle={componentStyles.buttonGroupInnerBorderStyle}
              buttonStyle={componentStyles.buttonGroupButtonStyle}
              containerStyle={componentStyles.buttonGroupContainerStyle}
              underlayColor="transparent"
              onPress={setRegisterAsSelectedIndex}
            />
          </View>

          <Text
            style={styles.marginBottomMd}
            accessibilityLabel={translate('register.intro_text')}>
            {translate('register.intro_text')}
          </Text>

          <View style={styles.marginBottomMd}>
            <Text
              style={[styles.formLabel, styles.fontWeightBold]}
              accessibilityLabel={translate('register.language.label')}>
              {translate('register.language.label')}
            </Text>
            <View
              style={[
                styles.formControl,
                styles.bgGreyLight,
                { borderColor: theme.colors.grey9 },
              ]}
              accessible={true}
              accessibilityLabel={translate('register.language.label')}
            >
              <SelectPicker
                placeholder={{}}
                value={language}
                onValueChange={handleLanguageChange}
                items={
                  language
                    ? languages.map((lang) => ({
                      label: lang.name,
                      value: lang.id,
                    }))
                    : []
                }
                accessibilityLabel={translate('register.language.label')}
              />
            </View>
          </View>

          {registerAsSelectedIndex === 0 && (
            <>
              <Text
                style={[
                  styles.formLabel,
                  styles.fontWeightBold,
                ]}
                accessibilityLabel={translate('register.phone.label')}>
                {translate('register.phone.label')}
              </Text>
              <View style={styles.flexRow}>
                <View
                  style={[
                    phoneCodeContainerStyle,
                    styles.formControl,
                    styles.bgGreyLight,
                    { borderColor: theme.colors.grey9 },
                  ]}
                  accessible={true}
                  accessibilityLabel={translate('register.phone.country_code')}
                >
                  <SelectPicker
                    placeholder={{}}
                    value={countryIsoCode}
                    onValueChange={handleCountryCodeChange}
                    items={
                      countryPhoneCode
                        ? definedCountries.map((country) => ({
                          label: `${country.name} (+${country.phone_code})`,
                          value: country.iso_code,
                          inputLabel: `+${country.phone_code}`,
                        }))
                        : []
                    }
                    accessibilityLabel={translate('register.phone.country_code')}
                  />
                </View>
                <View
                  style={[
                    phoneContainerStyle,
                    styles.bgGreyLight,
                    styles.formControl,
                    { borderColor: theme.colors.grey9 },
                  ]}
                  accessible={true}
                  accessibilityLabel={translate('register.phone.placeholder')}>
                  <Input
                    placeholder={translate('register.placeholder.phone')}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={(number) => setPhoneNumber(number)}
                    inputContainerStyle={inputPhoneContainerStyle}
                    accessibilityLabel={translate('register.phone.placeholder')}
                  />
                </View>
              </View>
              {errorPhoneNumber && (
                <View style={styles.marginBottom}>
                  <Text
                    style={styles.textDanger}
                    accessibilityLabel={translate('error.message.phone.created')}>
                    {translate('error.message.phone.created')}
                  </Text>
                </View>
              )}
            </>
          )}

          {registerAsSelectedIndex === 1 && (
            <>
              <TextField
                label={translate('register.email.label')}
                placeholder={translate('register.email.placeholder')}
                keyboardType="email-address"
                variant="filled"
                value={email}
                onChangeText={setEmail}
                renderErrorMessage={errorEmail}
                errorMessage={errorEmail ? translate('error.message.email') : null}
              />
              <TextField
                label={translate('register.password.label')}
                placeholder={translate('register.password.placeholder')}
                variant="filled"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                renderErrorMessage={errorPassword}
                errorMessage={errorPassword ? translate('error.message.password') : null}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.FORGOTPASSWORD, {email})}
              >
                <Text
                  style={styles.textPrimaryBold}
                  accessibilityLabel={translate('common.forgot_password_button')}
                >
                  {translate('common.forgot_password_button')}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <Button
            onPress={handleRegister}
            title={translate('common.next')}
            containerStyle={styles.marginTopLg}
            disabled={!shouldRegister}
            accessibilityLabel={translate('common.next')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const componentStyles = StyleSheet.create({
  buttonGroupInnerBorderStyle: {
    width: 0,
  },
  buttonGroupButtonStyle: {
    borderRadius: 20,
  },
  buttonGroupContainerStyle: {
    ...styles.bgGreyLight,
    borderRadius: 20,
  },
});

export default withTheme(Register);
