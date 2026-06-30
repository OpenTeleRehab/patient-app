/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  View,
  Platform,
  ScrollView,
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
import {getTranslate} from 'react-localize-redux';
import {getHash} from 'react-native-otp-auto-verify';
import DeviceCountry from 'react-native-device-country';
import styles from '../../../assets/styles';
import _ from 'lodash';

import {registerRequest} from '../../../store/register/actions';
import {getCountryRequest, getDefinedCountries} from '../../../store/country/actions';
import {getLanguageRequest} from '../../../store/language/actions';
import {getTranslations} from '../../../store/translation/actions';
import {getPhoneRequest} from '../../../store/phone/actions';
import SelectPicker from '../../../components/Common/SelectPicker';
import {Country} from '../../../services/country';
import {ROUTES, USER_ROLE} from '../../../variables/constants';
import HeaderBar from '../../../components/Common/HeaderBar';
import TextField from '../../../components/Common/TextField';
import validateEmail from '../../../utils/validateEmail';
import AppKeyboardView from '../../../components/Common/AppKeyboardView';

const Register = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile} = useSelector((state) => state.user);
  const {definedCountries} = useSelector((state) => state.country);
  const {languages} = useSelector((state) => state.language);
  const [language, setLanguage] = useState('');
  const [registerAsSelectedIndex, setRegisterAsSelectedIndex] = useState(0);
  const [hash, setHash] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [defaultCountryCode, setDefaultCountryCode] = useState('');
  const countryCodeRef = useRef('');

  const shouldRegister = registerAsSelectedIndex === 0
    ? phoneNumber
    : email && password;

  const countryItems = useMemo(
    () =>
      definedCountries?.map((country) => ({
        label: `${country.name} (+${country.phone_code})`,
        value: country.iso_code,
        key: country.iso_code,
        inputLabel: `+${country.phone_code}`,
      })) ?? [],
    [definedCountries],
  );

  useEffect(() => {
    if (!definedCountries?.length) {
      return;
    }

    const fallbackCountryCode = definedCountries[0].iso_code;

    const applyPhoneCode = (countryCode) => {
      setDefaultCountryCode(countryCode);
      countryCodeRef.current = countryCode;
    };

    DeviceCountry.getCountryCode()
      .then((result) => {
        const countryCode = _.find(definedCountries, {iso_code: result?.code?.toUpperCase()})?.iso_code ?? fallbackCountryCode;

        applyPhoneCode(countryCode);
      })
      .catch(() => {
        applyPhoneCode(fallbackCountryCode);
      });
  }, [definedCountries]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      getHash().then((hashes) => {
        if (hashes?.length > 0) {
          setHash(hashes[0]);
        }
      });
    }
  }, []);

  useEffect(() => {
    dispatch(getCountryRequest());
    dispatch(getDefinedCountries());
    dispatch(getLanguageRequest());
  }, [dispatch]);

  useEffect(() => {
    if (profile && profile.language_id) {
      setLanguage(profile.language_id);
    } else if (languages && languages.length) {
      setLanguage(languages[0].id);
    }
  }, [languages, profile]);

  const handleCountryCodeChange = (countryCode) => {
    countryCodeRef.current = countryCode;
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);

    dispatch(getTranslations(lang));
  };

  const handleRegister = () => {
    setErrorPhoneNumber(false);
    setErrorEmail(false);
    setErrorPassword(false);

    if (registerAsSelectedIndex === 0) {
      setErrorPhoneNumber(false);

      const countryPhoneCode = _.find(definedCountries, {iso_code: countryCodeRef.current})?.phone_code;
      const formattedNumber = `${countryPhoneCode}${parseInt(phoneNumber, 10)}`;

      dispatch(getPhoneRequest({phone: formattedNumber})).then((phone) => {
        if (phone) {
          Country.getCountryCodeByClinicId({clinic_id: phone.clinic_id, service_type: phone.service_type})
            .then((res) => {
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
            })
            .catch((err) => {
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
        dispatch(
          registerRequest(
            '',
            '',
            '',
            '',
            email,
            password,
            USER_ROLE.HEALTH_WORKER,
          ),
        ).then((res) => {
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
    <>
      <HeaderBar
        onGoBack={_.isEmpty(profile) ? undefined : () => navigation.goBack()}
        title={translate('common.register')}
      />
      <AppKeyboardView>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.flex1}
          contentContainerStyle={styles.mainContainerLight}>
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
                  {borderColor: theme.colors.grey9},
                ]}
                accessible={true}
                accessibilityLabel={translate('register.language.label')}>
                <SelectPicker
                  placeholder={{}}
                  value={language}
                  onValueChange={handleLanguageChange}
                  items={
                    languages
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
                  accessibilityLabel={translate('register.phone.label')}
                  style={[styles.formLabel, styles.fontWeightBold]}>
                  {translate('register.phone.label')}
                </Text>
                <View style={styles.flexRow}>
                  <View
                    accessible={true}
                    accessibilityLabel={translate('register.phone.label')}
                    style={componentStyles.phoneCountryCodeContainerStyle}>
                    <SelectPicker
                      key={`phone_code_${defaultCountryCode}`}
                      placeholder={{}}
                      itemKey={defaultCountryCode}
                      onValueChange={handleCountryCodeChange}
                      items={countryItems}
                      accessibilityLabel={translate('register.phone.label')}
                    />
                  </View>
                  <View
                    accessible={true}
                    accessibilityLabel={translate('register.phone.placeholder')}
                    style={componentStyles.phoneNumberContainerStyle}>
                    <Input
                      accessibilityLabel={translate(
                        'register.phone.placeholder',
                      )}
                      placeholder={translate('register.placeholder.phone')}
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={(number) => setPhoneNumber(number)}
                      inputContainerStyle={componentStyles.inputContainerStyle}
                    />
                  </View>
                </View>
                {errorPhoneNumber && (
                  <View style={styles.marginBottom}>
                    <Text
                      style={styles.textDanger}
                      accessibilityLabel={translate(
                        'error.message.phone.created',
                      )}>
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
                  errorMessage={
                    errorEmail ? translate('error.message.email') : null
                  }
                />
                <TextField
                  label={translate('register.password.label')}
                  placeholder={translate('register.password.placeholder')}
                  variant="filled"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  renderErrorMessage={errorPassword}
                  errorMessage={
                    errorPassword ? translate('error.message.password') : null
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(ROUTES.FORGOT_PASSWORD_SCREEN, {email})
                  }>
                  <Text
                    style={styles.textPrimaryBold}
                    accessibilityLabel={translate(
                      'common.forgot_password_button',
                    )}>
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
      </AppKeyboardView>
    </>
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
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  phoneCountryCodeContainerStyle: {
    ...styles.formControl,
    backgroundColor: '#E6E8EA',
    borderColor: '#E6E8EA',
    marginRight: 5,
    height: '60%',
    width: '35%',
  },
  phoneNumberContainerStyle: {
    ...styles.formControl,
    backgroundColor: '#E6E8EA',
    borderColor: '#E6E8EA',
    height: '60%',
    width: '65%',
  },
});

export default withTheme(Register);
