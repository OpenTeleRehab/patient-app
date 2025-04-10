/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Platform, ScrollView, SafeAreaView} from 'react-native';
import {Button, Input, Text, withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import _ from 'lodash';
import styles from '../../../assets/styles';

import {registerRequest} from '../../../store/user/actions';
import {
  getCountryRequest,
  getDefinedCountries,
} from '../../../store/country/actions';
import {getLanguageRequest} from '../../../store/language/actions';
import {getTranslations} from '../../../store/translation/actions';
import {getPhoneRequest} from '../../../store/phone/actions';
import SelectPicker from '../../../components/Common/SelectPicker';
import HeaderBar from '../../../components/Common/HeaderBar';
import {Country} from '../../../services/country';
import {ROUTES} from '../../../variables/constants';

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

const Register = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {isLoading, profile} = useSelector((state) => state.user);
  const {definedCountries, userCountryCode} = useSelector(
    (state) => state.country,
  );
  const {languages} = useSelector((state) => state.language);
  const [hash, setHash] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryPhoneCode, setCountryPhoneCode] = useState('');
  const [countryIsoCode, setCountryIsoCode] = useState('');
  const [language, setLanguage] = useState('');
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
    const selectedCountry = _.find(definedCountries, {iso_code: isoCode});
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
    let mobileNumber = '';
    if (phoneNumber.startsWith(countryPhoneCode)) {
      mobileNumber = phoneNumber.replace(countryPhoneCode, '');
    } else {
      mobileNumber = phoneNumber;
    }

    const formattedNumber = countryPhoneCode + parseInt(mobileNumber, 10);
    dispatch(getPhoneRequest({phone: formattedNumber})).then((phone) => {
      if (phone) {
        dispatch(getCountryRequest());

        Country.getCountryCodeByClinicId(phone.clinic_id).then((res) => {
          if (res.success) {
            dispatch(
              registerRequest(
                countryPhoneCode,
                formattedNumber,
                hash,
                res.data.iso_code,
              ),
            ).then((result) => {
              if (result) {
                navigation.navigate(ROUTES.VERIFY_PHONE);
              } else {
                setErrorPhoneNumber(true);
              }
            });
          }
        });
      } else {
        setErrorPhoneNumber(true);
      }
    });
  };

  return (
    <SafeAreaView style={styles.bgPrimary}>
      {!_.isEmpty(profile) ? (
        <HeaderBar
          backgroundPrimary={true}
          onGoBack={() => navigation.goBack()}
          title={translate('common.register')}
        />
      ) : (
        <HeaderBar
          backgroundPrimary={true}
          title={translate('common.register')}
        />
      )}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={[styles.mainContainerLight, contentContainer]}>
        <View style={styles.paddingMd}>
          <Text
            style={styles.marginBottomMd}
            accessibilityLabel={translate('register.intro_text')}>
            {translate('register.intro_text')}
          </Text>
          <View>
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
          <Text
            style={[
              styles.formLabel,
              styles.marginTopMd,
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
                {borderColor: theme.colors.grey9},
              ]}
              accessible={true}
              accessibilityLabel={translate('register.phone.country_code')}>
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
                {borderColor: theme.colors.grey9},
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
          <Button
            onPress={handleRegister}
            title={translate('common.next')}
            containerStyle={styles.marginTopLg}
            disabled={isLoading || !phoneNumber}
            accessibilityLabel={translate('common.next')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default withTheme(Register);
