/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import {Text, Header, Button} from 'react-native-elements';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

import styles from '../../../assets/styles/index';

const Pin = ({navigation}) => {
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');

  const handlerSave = () => {
    if (code && confirmCode) {
      if (code !== confirmCode) {
        Alert.alert(
          '',
          'PIN does not match.',
          [{text: 'OK', onPress: () => handlerRest()}],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          '',
          'Your PIN number is set up successfully.',
          [{text: 'OK', onPress: () => handlerRest()}],
          {cancelable: false},
        );
      }
    }
  };

  const handlerRest = () => {
    setCode('');
    setConfirmCode('');
  };

  return (
    <>
      <Header
        backgroundColor="white"
        rightComponent={{text: 'Cancel', onPress: () => navigation.goBack()}}
        centerComponent={{text: 'Setup PIN number'}}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={[styles.flexCenter]}>
          <Text p>New PIN Number</Text>
          <SmoothPinCodeInput
            password
            mask="﹡"
            value={code}
            onTextChange={(value) => setCode(value)}
          />
        </View>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <Text p>Confirm new PIN Number</Text>
          <SmoothPinCodeInput
            password
            mask="﹡"
            value={confirmCode}
            onTextChange={(value) => setConfirmCode(value)}
          />
        </View>
        <View style={[styles.paddingMd]}>
          <Button
            title="Confirm"
            onPress={() => handlerSave()}
            disabled={!code && !confirmCode}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Pin;
