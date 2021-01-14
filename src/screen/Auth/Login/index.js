/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {View, Image, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {loginRequest} from '../../../store/user/actions';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {getLocalData} from '../../../utils/local_storage';
import {ROUTES} from '../../../variables/constants';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData('OrgHiPatientApp', true);
    if (data) {
      setPhone(data.phone);
    }
  }, []);

  const handleLogin = () => {
    dispatch(loginRequest(phone, code)).then((result) => {
      if (!result) {
        Alert.alert(
          'Login',
          'PIN is incorrect.',
          [{text: 'OK', onPress: () => reset()}],
          {cancelable: false},
        );
      }
    });
  };

  const reset = () => {
    setCode('');
  };

  useEffect(() => {
    fetchLocalData();
  }, [fetchLocalData]);

  return (
    <>
      <View style={styles.authBanner}>
        <Image source={logoWhite} style={styles.authLogoWhite} />
      </View>
      <ScrollView style={styles.mainContainerLight}>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text>Mobile Number</Text>
            <Text style={[styles.marginTop, styles.leadText, styles.textDark]}>
              {phone}
            </Text>
            <TouchableOpacity
              style={styles.marginTop}
              onPress={() => navigation.navigate(ROUTES.REGISTER)}>
              <Text style={styles.hyperlink}>Login with other number</Text>
            </TouchableOpacity>
            <Text style={styles.marginTop}>Enter PIN Number</Text>
            <SmoothPinCodeInput
              password
              value={code}
              onTextChange={(value) => setCode(value)}
              textStyle={styles.formPinText}
              cellStyleFocused={styles.formPinCellFocused}
              containerStyle={styles.formPinContainer}
              cellStyleFilled={styles.formPinCellFilled}
              cellStyle={styles.formPinCell}
              cellSpacing={10}
              animated={false}
              mask={<View style={styles.formPinCustomMask} />}
            />
            <TouchableOpacity
              style={styles.marginTop}
              onPress={() => navigation.navigate(ROUTES.REGISTER)}>
              <Text style={styles.hyperlink}>I forgot my PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.paddingMd}>
          <Button onPress={() => handleLogin()} title="Login" />
        </View>
      </ScrollView>
    </>
  );
};

export default Login;
