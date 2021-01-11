/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {useDispatch} from 'react-redux';
import {View, Image} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Card, Input, Text} from 'react-native-elements';
import {userLoginRequest} from '../../../store/user/actions';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(userLoginRequest());
  };

  return (
    <>
      <View style={styles.authBanner}>
        <Image source={logoWhite} style={styles.authLogoWhite} />
      </View>
      <Card>
        <Input
          label="Enter your mobile number"
          labelStyle={styles.formLabel}
          inputStyle={styles.formControl}
          inputContainerStyle={styles.noneBorderBottom}
        />
        <View>
          <Text>Language</Text>
          <Picker prompt="Language">
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Vietnam" value="vn" />
          </Picker>
        </View>
        <Button onPress={() => handleLogin()} title="Login" />
      </Card>
    </>
  );
};

export default Login;
