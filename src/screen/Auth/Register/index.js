/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {View, Image} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Card, Input, Text} from 'react-native-elements';

import styles from '../../../assets/styles';

import logoWhite from '../../../assets/images/logo-white.png';
import {ROUTES} from '../../../variables/constants';

const Register = ({navigation}) => {
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
        <Button
          onPress={() => navigation.navigate(ROUTES.TERM_OF_SERVICE)}
          title="Register"
        />
      </Card>
    </>
  );
};

export default Register;
