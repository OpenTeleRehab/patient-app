/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Image, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Input, Text} from 'react-native-elements';
import PhoneInput from 'react-native-phone-input';

import styles from '../../../assets/styles';

import logoWhite from '../../../assets/images/logo-white.png';
import {ROUTES} from '../../../variables/constants';

import {registerRequest} from '../../../store/user/actions';
import {getTranslate} from 'react-localize-redux';

const customFlagStyle = {
  width: 50,
  height: 30,
  marginBottom: 20,
};

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  let phoneRef = useRef();

  const onRegister = () => {
    setErrorPhoneNumber(false);
    const formattedNumber = phoneRef.getCountryCode() + phoneNumber;
    dispatch(registerRequest(formattedNumber)).then((result) => {
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
          <PhoneInput
            ref={(ref) => (phoneRef = ref)}
            value={phoneNumber}
            onChangePhoneNumber={(number) => setPhoneNumber(number)}
            initialCountry={'vn'}
            textProps={{
              placeholder: translate('placeholder.phone'),
              inputContainerStyle: styles.noneBorderBottom,
            }}
            textComponent={Input}
            textStyle={styles.formControl}
            flagStyle={customFlagStyle}
            countriesList={[
              {
                name: 'Cambodia (កម្ពុជា)',
                iso2: 'kh',
                dialCode: '855',
                priority: 1,
                areaCodes: null,
              },
              {
                name: 'Vietnam (Việt Nam)',
                iso2: 'vn',
                dialCode: '84',
                priority: 0,
                areaCodes: null,
              },
            ]}
          />

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
              </Picker>
            </View>
          </View>
          <Button
            onPress={onRegister}
            title={translate('common.register')}
            containerStyle={styles.marginTopLg}
            titleStyle={styles.textUpperCase}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Register;
