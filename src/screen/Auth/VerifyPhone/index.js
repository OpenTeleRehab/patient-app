/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useEffect} from 'react';
import {Button, Input, Text} from 'react-native-elements';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
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
import formatPhoneNumber from '../../../utils/phoneNumber';
import useInterval from '../../../hook/useInterval';
import validateEmail from '../../../utils/validateEmail';

let RNOtpVerify;
if (Platform.OS === 'android') {
  RNOtpVerify = require('@webessentials/react-native-otp-verify').default;
}

const VerifyPhone = ({navigation}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const formattedNumber = useSelector((state) => state.user.phone);
  const dialCode = useSelector((state) => state.user.dial_code);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const isLoading = useSelector((state) => state.user.isLoading);
  const [hash, setHash] = useState('');
  const [count, setCount] = useState(30);
  const [resentCount, setResentCount] = useState(0);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorCode, setErrorCode] = useState(false);

  useInterval(() => {
    if (count > 0) {
      setCount(count - 1);
    } else if (!showEmail && resentCount >= 5) {
      setShowEmail(true);
    }
  }, 1000);

  useEffect(() => {
    if (RNOtpVerify && hash === '') {
      RNOtpVerify.getHash().then((hasCode) => {
        setHash(hasCode);
      });
      RNOtpVerify.getOtp()
        .then((p) => RNOtpVerify.addListener(otpHandler))
        .catch((p) => console.log(p));
    }
  }, [hash]);

  const onConfirm = (verifyCode) => {
    dispatch(verifyPhoneNumberRequest(formattedNumber, verifyCode, email)).then(
      (result) => {
        if (result) {
          if (RNOtpVerify) {
            RNOtpVerify.removeListener();
          }
          navigation.navigate(ROUTES.TERM_OF_SERVICE);
        } else {
          Alert.alert(
            translate('error.message.incorrect.code').toString(),
            translate('prompt.enter.code').toString(),
            [{text: translate('common.ok').toString(), onPress: () => reset()}],
            {cancelable: false},
          );
          setErrorCode(true);
        }
      },
    );
  };

  const onResent = () => {
    if (showEmail && (email === '' || !validateEmail(email))) {
      setErrorEmail(true);
      return false;
    }

    setErrorEmail(false);
    setCount(30);
    setResentCount(resentCount + 1);
    dispatch(registerRequest(dialCode, formattedNumber, hash, null, email));
  };

  const reset = () => {
    setCode('');
  };

  const otpHandler = (message) => {
    try {
      if (message) {
        const messageArray = message.split(': ');
        if (messageArray[1]) {
          const otp = messageArray[1].substring(0, 6);
          setCode(otp);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={true}
        title={translate('phone.verify')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.mainContainerLight}>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <Text style={styles.marginBottomMd}>
            {translate('phone.verify_discription', {
              phone: formatPhoneNumber(dialCode, formattedNumber),
            })}
          </Text>
          <SmoothPinCodeInput
            codeLength={6}
            value={code}
            onTextChange={(pinCode) => [setCode(pinCode), setErrorCode(false)]}
            animated={false}
            cellSpacing={10}
            textStyle={errorCode ? styles.formPinTextError : styles.formPinText}
            containerStyle={[styles.formPinContainer, styles.marginBottom]}
            cellStyle={[
              styles.formPinCell,
              errorCode && styles.formPinCellError,
            ]}
            cellStyleFocused={!errorCode && styles.formPinCellFocused}
            cellStyleFilled={
              errorCode ? styles.formPinCellError : styles.formPinCellFilled
            }
            onFulfill={(verifyCode) => onConfirm(verifyCode)}
          />
          {showEmail && (
            <>
              <Input
                label={translate('common.email')}
                placeholder={translate('placeholder.email')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(value) => setEmail(value)}
                containerStyle={styles.marginBottom}
                disabled={count > 0}
                renderErrorMessage={errorEmail}
                errorMessage={
                  errorEmail ? translate('error.message.email') : null
                }
              />
            </>
          )}
          <View style={[styles.flexRow, styles.marginY]}>
            <Text>{translate('phone.dont.receive.code')} &nbsp;</Text>
            {count > 0 ? (
              <Text>{count}</Text>
            ) : (
              <TouchableOpacity onPress={onResent} disabled={isLoading}>
                <Text style={styles.hyperlink}>
                  {translate('phone.resend.code')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default VerifyPhone;
