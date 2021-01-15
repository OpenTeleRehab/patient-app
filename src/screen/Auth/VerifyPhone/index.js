/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useEffect} from 'react';
import {Button, Text} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View, Alert} from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styles from '../../../assets/styles';
import {ROUTES} from '../../../variables/constants';
import {
  registerRequest,
  verifyPhoneNumberRequest,
} from '../../../store/user/actions';
import {useDispatch, useSelector} from 'react-redux';
import HeaderBar from '../../../components/Common/HeaderBar';
import {getTranslate} from 'react-localize-redux';
import RNOtpVerify from 'react-native-otp-verify';

const VerifyPhone = ({navigation}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const formattedNumber = useSelector((state) => state.user.phone);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const onConfirm = () => {
    dispatch(verifyPhoneNumberRequest(formattedNumber, code)).then((result) => {
      if (result) {
        RNOtpVerify.removeListener();
        navigation.navigate(ROUTES.TERM_OF_SERVICE);
      } else {
        Alert.alert(
          'Incorrect code',
          'Please enter the correct code or resend a new code.',
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

  const otpHandler = (message) => {
    try {
      if (message) {
        const messageArray = message.split(': ');
        if (messageArray[1]) {
          const otp = messageArray[1].split('\n')[0];
          setCode(otp);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    RNOtpVerify.getOtp()
      .then((p) => RNOtpVerify.addListener(otpHandler))
      .catch((p) => console.log(p));
  });

  return (
    <>
      <HeaderBar
        title={translate('phone.verify')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.flexCenter}>
          <Text style={styles.marginTop}>
            {translate('phone.verify.description')}
          </Text>
          <Text style={styles.marginY}>
            {translate('phone.send.to')}
            <Text style={styles.textDefaultBold}>&nbsp; {formattedNumber}</Text>
          </Text>
          <SmoothPinCodeInput
            codeLength={6}
            value={code}
            onTextChange={(pinCode) => setCode(pinCode)}
            animated={false}
            cellSpacing={10}
            textStyle={styles.formPinText}
            containerStyle={styles.formPinContainer}
            cellStyle={styles.formPinCell}
            cellStyleFocused={styles.formPinCellFocused}
            cellStyleFilled={styles.formPinCellFilled}
          />
          <View style={[styles.flexRow, styles.marginTop]}>
            <Text>{translate('phone.dont.receive.code')} &nbsp;</Text>
            <TouchableOpacity onPress={onResent}>
              <Text style={styles.hyperlink}>
                {translate('phone.resend.code')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.paddingMd]}>
          <Button
            containerStyle={[styles.marginTop, styles.alignSelfStretch]}
            titleStyle={styles.textUpperCase}
            disabled={code.length !== 6}
            onPress={onConfirm}
            title={translate('common.confirm')}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default VerifyPhone;
