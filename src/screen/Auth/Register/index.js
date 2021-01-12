/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {View, Image} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Card, Input, Text} from 'react-native-elements';
import PhoneInput from 'react-native-phone-input';

import styles from '../../../assets/styles';

import logoWhite from '../../../assets/images/logo-white.png';
import {ROUTES} from '../../../variables/constants';

import {registerRequest} from '../../../store/user/actions';

const customFlagStyle = {
  width: 50,
  height: 30,
  marginBottom: 20,
};

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);
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
      <Card>
        <PhoneInput
          ref={(ref) => (phoneRef = ref)}
          value={phoneNumber}
          onChangePhoneNumber={(number) => setPhoneNumber(number)}
          initialCountry={'vn'}
          textProps={{
            placeholder: 'Enter phone number',
            inputContainerStyle: styles.noneBorderBottom,
          }}
          textComponent={Input}
          textStyle={styles.formControl}
          flagStyle={customFlagStyle}
          offset={20}
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
        <View>
          {errorPhoneNumber && (
            <Text style={styles.textDanger}>
              This number is not created account. Please contact your therapist
              to create an account for you.
            </Text>
          )}
          <Text>Language</Text>
          <Picker prompt="Language" style={styles.formControl}>
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Vietnam" value="vn" />
          </Picker>
        </View>
        <Button onPress={onRegister} title="Register" />
      </Card>
    </>
  );
};

export default Register;
