/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Image, Platform, ScrollView} from 'react-native';
import {Button, Divider, Input, Text, withTheme} from 'react-native-elements';
import _ from 'lodash';

import styles from '../../../assets/styles';

import logoWhite from '../../../assets/images/logo-white.png';
import {ROUTES} from '../../../variables/constants';

import {registerRequest} from '../../../store/user/actions';
import {getTranslate} from 'react-localize-redux';
import {getCountryRequest} from '../../../store/country/actions';
import {getLanguageRequest} from '../../../store/language/actions';
import {getTranslations} from '../../../store/translation/actions';
import SelectPicker from '../../../components/Common/SelectPicker';

let RNOtpVerify;
if (Platform.OS === 'android') {
  RNOtpVerify = require('@webessentials/react-native-otp-verify').default;
}

const phoneCodeContainerStyle = {
  width: '25%',
  marginRight: 5,
};
const phoneContainerStyle = {
  width: '75%',
};

const phoneCodeDividerStyle = {
  height: 1,
};

const Register = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const isLoading = useSelector((state) => state.user.isLoading);
  const {countries, userCountryCode} = useSelector((state) => state.country);
  const {languages} = useSelector((state) => state.language);

  const [hash, setHash] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryPhoneCode, setCountryPhoneCode] = useState('');
  const [language, setLanguage] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);

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
    dispatch(getCountryRequest());
    dispatch(getLanguageRequest());
  }, [dispatch]);

  // Set default selected phone code
  useEffect(() => {
    if (countries.length) {
      let defaultCountry = countries[0];

      if (userCountryCode) {
        const userCountry = _.find(countries, {iso_code: userCountryCode});
        if (userCountry) {
          defaultCountry = userCountry;
        }
      }

      setCountryPhoneCode(defaultCountry.phone_code);
      validateAndSetLanguage(defaultCountry.language_id);
      setCountryCode(defaultCountry.iso_code);
    }
  }, [countries, userCountryCode, dispatch, validateAndSetLanguage]);

  const handlePhoneCodeChange = (phoneCode) => {
    setCountryPhoneCode(phoneCode);
    const selectedCountry = _.find(countries, {phone_code: phoneCode});
    validateAndSetLanguage(selectedCountry.language_id);
    setCountryCode(selectedCountry.iso_code);
  };

  const handleLanguageChange = (lang) => {
    validateAndSetLanguage(lang);
    dispatch(getTranslations(lang));
  };

  const handleRegister = () => {
    setErrorPhoneNumber(false);
    const mobileNumber = phoneNumber.replace(countryPhoneCode, '');
    const formattedNumber = `${countryPhoneCode}${parseInt(mobileNumber, 10)}`;
    dispatch(registerRequest(formattedNumber, hash, countryCode)).then(
      (result) => {
        if (result) {
          navigation.navigate(ROUTES.VERIFY_PHONE);
        } else {
          setErrorPhoneNumber(true);
        }
      },
    );
  };

  return (
    <>
      <View style={styles.authBanner}>
        <Image source={logoWhite} style={styles.authLogoWhite} />
      </View>
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.paddingMd}>
          <Text style={styles.formLabel}>{translate('common.phone')}</Text>
          <View style={styles.flexRow}>
            <View style={phoneCodeContainerStyle}>
              <SelectPicker
                placeholder={{}}
                value={countryPhoneCode}
                onValueChange={handlePhoneCodeChange}
                items={
                  countryPhoneCode
                    ? countries.map((country) => ({
                        label: `${country.name} (+${country.phone_code})`,
                        value: country.phone_code,
                        inputLabel: `+${country.phone_code}`,
                      }))
                    : []
                }
              />
              <Divider
                style={[
                  phoneCodeDividerStyle,
                  {backgroundColor: theme.colors.grey3},
                ]}
              />
            </View>
            <View style={phoneContainerStyle}>
              <Input
                placeholder={translate('placeholder.phone')}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(number) => setPhoneNumber(number)}
              />
            </View>
          </View>
          {errorPhoneNumber && (
            <View style={styles.marginBottom}>
              <Text style={styles.textDanger}>
                {translate('error.message.phone.created')}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.formLabel}>{translate('common.language')}</Text>
            <View style={styles.formControl}>
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
              />
            </View>
          </View>
          <Button
            onPress={handleRegister}
            title={translate('common.register')}
            containerStyle={styles.marginTopLg}
            titleStyle={styles.textUpperCase}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(Register);
