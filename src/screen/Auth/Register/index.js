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

const phoneCodeContainerStyle = {
  width: '30%',
  marginRight: 5,
};
const phoneContainerStyle = {
  width: '70%',
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
const modalTitleStyle = {
  fontWeight: 'bold',
};
const phoneCodeDividerStyle = {
  height: 1,
};

const Register = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryPhoneCode, setCountryPhoneCode] = useState(84);
  const [hash, setHash] = useState('');
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const isLoading = useSelector((state) => state.user.isLoading);
  const {countries} = useSelector((state) => state.country);
  const [modalVisible, setModalVisible] = useState(false);
  const phoneInput = useRef();

  const onRegister = () => {
    setErrorPhoneNumber(false);
    const formattedInputPhoneNumber = phoneNumber.replace(countryPhoneCode, '');
    const formattedNumber = `${countryPhoneCode}${parseInt(
      formattedInputPhoneNumber,
      10,
    )}`;
    dispatch(registerRequest(formattedNumber, hash)).then((result) => {
      if (result) {
        navigation.navigate(ROUTES.VERIFY_PHONE);
      } else {
        setErrorPhoneNumber(true);
      }
    });
  };

  useEffect(() => {
    dispatch(getCountryRequest());
  }, [dispatch]);

  useEffect(() => {
    RNOtpVerify.getHash().then((code) => {
      setHash(code);
    });
  }, []);

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
                    {'+' + countryPhoneCode}
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
              <Picker prompt={translate('common.language')}>
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Vietnam" value="vn" />
                <Picker.Item label="Philippines" value="ph" />
              </Picker>
            </View>
          </View>
          <Button
            onPress={onRegister}
            title={translate('common.register')}
            containerStyle={styles.marginTopLg}
            titleStyle={styles.textUpperCase}
            disabled={isLoading}
          />
        </View>
        <View>
          <Modal
            backdropTransitionOutTiming={0}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            isVisible={modalVisible}
            onBackButtonPress={() => setModalVisible(false)}
            onBackdropPress={() => setModalVisible(false)}>
            <View style={modalView}>
              <Text style={[styles.formLabel, modalTitleStyle]}>
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
                      <Text>
                        {country.name + ' (' + '+' + country.phone_code + ')'}
                      </Text>
                    </TouchableHighlight>
                    {_.findLastIndex(countries) !== i && (
                      <Divider style={{backgroundColor: theme.colors.grey3}} />
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(Register);
