/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Button, Header, Text, withTheme} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View, Alert} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styles from '../../../assets/styles';
import {ROUTES} from '../../../variables/constants';
import {
  registerRequest,
  verifyPhoneNumberRequest,
} from '../../../store/user/actions';
import {useDispatch, useSelector} from 'react-redux';

const VerifyPhone = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const formattedNumber = useSelector((state) => state.user.phone);

  const onConfirm = () => {
    dispatch(verifyPhoneNumberRequest(formattedNumber, code)).then((result) => {
      if (result) {
        navigation.navigate(ROUTES.TERM_OF_SERVICE);
      } else {
        Alert.alert(
          'Verify Phone',
          'PIN is incorrect.',
          [{text: 'OK', onPress: () => reset()}],
          {cancelable: false},
        );
      }
    });
  };

  const onResent = () => {
    dispatch(registerRequest(formattedNumber));
  };

  const reset = () => {
    setCode('');
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
        centerComponent={{
          text: 'Verify Phone',
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.flexCenter}>
          <Text>
            We sent you a code to verify your phone number. Please input it
            below.
          </Text>
          <Text style={styles.marginTop}>Sent to {formattedNumber}</Text>
          <SmoothPinCodeInput
            codeLength={6}
            value={code}
            onTextChange={(pinCode) => setCode(pinCode)}
            animated={false}
            containerStyle={styles.marginTop}
            textStyle={styles.smoothPinTextStyle}
            cellStyleFocused={styles.smoothPinCellStyle}
            cellSize={60}
          />
          <View style={[styles.flexRow, styles.marginTop]}>
            <Text>I didn't receive a code!&nbsp;</Text>
            <TouchableOpacity onPress={onResent}>
              <Text style={styles.hyperlink}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.paddingMd]}>
          <Button
            containerStyle={[styles.marginTop, styles.alignSelfStretch]}
            disabled={code.length !== 6}
            onPress={onConfirm}
            title="CONFIRM"
          />
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(VerifyPhone);
