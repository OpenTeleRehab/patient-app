/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  Button,
  Divider,
  Icon,
  Input,
  Text,
  withTheme,
} from 'react-native-elements';
import RNOtpVerify from '@webessentials/react-native-otp-verify';

import styles from '../../../assets/styles';

import logoWhite from '../../../assets/images/logo-white.png';
import {ROUTES} from '../../../variables/constants';

import {registerRequest} from '../../../store/user/actions';
import {getTranslate} from 'react-localize-redux';
import {getCountryRequest} from '../../../store/country/actions';
import Modal from 'react-native-modal';
import _ from 'lodash';
import {getLanguageRequest} from '../../../store/language/actions';
import {getTranslations} from '../../../store/translation/actions';

const phoneCodeContainerStyle = {
  width: '25%',
  marginRight: 5,
};
const phoneContainerStyle = {
  width: '75%',
};
const containerStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-start',
};
const modalView = {
  backgroundColor: 'white',
  alignItems: 'center',
  width: '100%',
  borderRadius: 3,
  paddingTop: 10,
};
const listElementStyle = {
  width: '100%',
  padding: 12,
  fontSize: 17,
};
const modalContentContainer = {
  width: '100%',
  padding: 0,
};
const phoneCodeSelectBoxStyle = {
  flex: 1,
  justifyContent: 'space-between',
  flexDirection: 'row',
  padding: 10,
  marginTop: 3,
};
const phoneCodeFontStyle = {
  fontSize: 17,
};
const phoneCodeDividerStyle = {
  height: 1,
};

const Register = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const isLoading = useSelector((state) => state.user.isLoading);
  const {countries} = useSelector((state) => state.country);
  const {languages} = useSelector((state) => state.language);
  const phoneInput = useRef();

  const [hash, setHash] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryPhoneCode, setCountryPhoneCode] = useState('');
  const [language, setLanguage] = useState('');
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);

  useEffect(() => {
    dispatch(getCountryRequest());
    dispatch(getLanguageRequest());
  }, [dispatch]);

  // Set default selected phone code
  useEffect(() => {
    if (countries.length) {
      setCountryPhoneCode(countries[0].phone_code);
    }
  }, [countries]);

  // Set language by phone code selected
  useEffect(() => {
    if (countryPhoneCode && countries.length) {
      const selectedCountry = _.findLast(countries, {
        phone_code: countryPhoneCode,
      });
      if (selectedCountry && selectedCountry.language_id) {
        setLanguage(selectedCountry.language_id);
        dispatch(getTranslations(selectedCountry.language_id));
      }
    }
  }, [countryPhoneCode, countries, dispatch]);

  useEffect(() => {
    RNOtpVerify.getHash().then((code) => {
      setHash(code);
    });
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    dispatch(getTranslations(lang));
  };

  const handleRegister = () => {
    setErrorPhoneNumber(false);
    const mobileNumber = phoneNumber.replace(countryPhoneCode, '');
    const formattedNumber = `${countryPhoneCode}${parseInt(mobileNumber, 10)}`;
    dispatch(registerRequest(formattedNumber, hash)).then((result) => {
      if (result) {
        navigation.navigate(ROUTES.VERIFY_PHONE);
      } else {
        setErrorPhoneNumber(true);
      }
    });
  };

  return (
    <>
      <View style={styles.authBanner}>
        <Image source={logoWhite} style={styles.authLogoWhite} />
      </View>
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.paddingMd}>
          <Text style={styles.formLabel}>{translate('common.phone')}</Text>
          <View style={containerStyle}>
            <View style={phoneCodeContainerStyle}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}>
                <View style={phoneCodeSelectBoxStyle}>
                  <Text style={phoneCodeFontStyle}>
                    {countryPhoneCode ? `+${countryPhoneCode}` : ''}
                  </Text>
                  <Text>
                    <Icon
                      name="caret-down"
                      size={15}
                      type="font-awesome-5"
                      color="black"
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    />
                  </Text>
                </View>
              </TouchableOpacity>
              <Divider
                style={[
                  phoneCodeDividerStyle,
                  {backgroundColor: theme.colors.grey3},
                ]}
              />
            </View>
            <View style={phoneContainerStyle}>
              <Input
                ref={phoneInput}
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
              <Picker
                prompt={translate('common.language')}
                selectedValue={language}
                onValueChange={handleLanguageChange}>
                {languages.map((lang, i) => (
                  <Picker.Item key={i} label={lang.name} value={lang.id} />
                ))}
              </Picker>
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
        <Modal
          backdropTransitionOutTiming={0}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          isVisible={modalVisible}
          onBackButtonPress={() => setModalVisible(false)}
          onBackdropPress={() => setModalVisible(false)}>
          <View style={modalView}>
            <Text style={[styles.formLabel, styles.fontWeightBold]}>
              {translate('common.country')}
            </Text>
            <ScrollView style={modalContentContainer}>
              {countries.map((country, i) => (
                <View key={i}>
                  <TouchableHighlight
                    key={i}
                    style={listElementStyle}
                    activeOpacity={0.6}
                    onPress={() => {
                      setCountryPhoneCode(country.phone_code);
                      setModalVisible(false);
                      phoneInput.current.focus();
                    }}
                    underlayColor={theme.colors.grey5}>
                    <Text>{`${country.name} (+${country.phone_code})`}</Text>
                  </TouchableHighlight>
                  {_.findLastIndex(countries) !== i && (
                    <Divider style={{backgroundColor: theme.colors.grey3}} />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

export default withTheme(Register);
