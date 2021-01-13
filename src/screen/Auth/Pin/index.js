/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import {Text, Header, Button, withTheme} from 'react-native-elements';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

import styles from '../../../assets/styles/index';
import {ROUTES} from '../../../variables/constants';
import {setupPinNumberRequest} from '../../../store/user/actions';
import {useSelector, useDispatch} from 'react-redux';

const Pin = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const phone = useSelector((state) => state.user.phone);
  const otpCode = useSelector((state) => state.user.otpCode);

  const handlerSave = () => {
    if (code && confirmCode) {
      if (code === confirmCode) {
        dispatch(setupPinNumberRequest(code, phone, otpCode)).then((result) => {
          if (result) {
            Alert.alert(
              'Setup PIN number',
              'Your PIN number is set up successfully.',
              [{text: 'OK', onPress: () => onSucceed()}],
              {cancelable: false},
            );
          } else {
            Alert.alert(
              'Setup PIN number',
              'Error while processing.',
              [{text: 'OK', onPress: () => handlerReset()}],
              {cancelable: false},
            );
          }
        });
      } else {
        Alert.alert(
          'Setup PIN number',
          'PIN does not match.',
          [{text: 'OK', onPress: () => handlerReset()}],
          {cancelable: false},
        );
      }
    }
  };

  const handlerReset = () => {
    setCode('');
    setConfirmCode('');
  };

  const onSucceed = () => {
    navigation.navigate(ROUTES.LOGIN);
  };

  const disabledConfirm = () => {
    return code.length !== 4 || confirmCode.length !== 4;
  };

  return (
    <>
      <Header
        backgroundColor="white"
        leftComponent={
          <Button
            type="clear"
            icon={{
              name: 'chevron-left',
              size: 50,
              color: theme.colors.primary,
            }}
            title="Back"
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{text: 'Setup PIN number'}}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={[styles.flexCenter]}>
          <View>
            <Text>New PIN Number</Text>
            <SmoothPinCodeInput
              password
              value={code}
              onTextChange={(value) => setCode(value)}
              textStyle={styles.smoothPinTextStyle}
              cellStyleFocused={styles.smoothPinCellStyle}
              containerStyle={styles.marginTop}
              cellSize={60}
              animated={false}
              mask={<View style={styles.customMask} />}
            />
          </View>
        </View>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text>Confirm new PIN Number</Text>
            <SmoothPinCodeInput
              password
              value={confirmCode}
              onTextChange={(value) => setConfirmCode(value)}
              textStyle={styles.smoothPinTextStyle}
              cellStyleFocused={styles.smoothPinCellStyle}
              containerStyle={styles.marginTop}
              cellSize={60}
              animated={false}
              mask={<View style={styles.customMask} />}
            />
          </View>
        </View>
        <View style={[styles.paddingMd]}>
          <Button
            title="Confirm"
            onPress={() => handlerSave()}
            disabled={disabledConfirm()}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(Pin);
