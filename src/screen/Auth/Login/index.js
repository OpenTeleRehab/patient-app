/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {Text} from 'react-native-elements';
import {
  loginRequest,
  fetchTermOfServiceRequest,
  generateFakeAccessToken,
  fetchPrivacyPolicyRequest,
} from '../../../store/user/actions';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';
import kidLogo from '../../../assets/images/quacker-pincode.png';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {ROUTES, STORAGE_KEY} from '../../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import {getCountryRequest} from '../../../store/country/actions';
import formatPhoneNumber from '../../../utils/phoneNumber';
import {getPhoneRequest} from '../../../store/phone/actions';
import {getLocalData} from '../../../utils/local_storage';

const containerStyle = {
  height: '100%',
};

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {profile, phone, countryCode, dial_code, pin} = useSelector(
    (state) => state.user,
  );
  const translate = getTranslate(localize);
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState();
  const [dialCode, setDialCode] = useState();
  const [errorCode, setErrorCode] = useState(false);

  const fetchLocalPhone = useCallback(async () => {
    if (phone && dial_code) {
      setPhoneNumber(phone);
      setDialCode(dial_code);
    } else {
      setPhoneNumber(await getLocalData(STORAGE_KEY.PHONE));
      setDialCode(await getLocalData(STORAGE_KEY.DIAL_CODE));
    }
  }, [dial_code, phone]);

  useEffect(() => {
    dispatch(getCountryRequest());
  }, [dispatch]);

  useEffect(() => {
    fetchLocalPhone().catch(console.error);
  }, [fetchLocalPhone]);

  const handleLogin = (passCode) => {
    dispatch(getPhoneRequest({phone: phoneNumber})).then((result) => {
      if (result) {
        dispatch(loginRequest(phoneNumber, passCode, countryCode)).then(
          (loginResult) => {
            if (loginResult.success) {
              if (
                !loginResult.acceptedTermOfService ||
                !loginResult.acceptedPrivacyPolicy
              ) {
                navigation.navigate(ROUTES.TERM_OF_SERVICE);
              }
            } else {
              if (passCode === pin) {
                dispatch(generateFakeAccessToken());
              } else {
                Alert.alert(
                  translate('common.login.fail'),
                  translate('wrong.pin'),
                  [{text: translate('common.ok'), onPress: () => reset()}],
                  {cancelable: false},
                );
                setErrorCode(true);
              }
            }
          },
        );
      }
    });
  };

  const reset = () => {
    setCode('');
  };

  useEffect(() => {
    dispatch(fetchTermOfServiceRequest());
    dispatch(fetchPrivacyPolicyRequest());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.bgLight}>
      <View style={!(profile && profile.kid_theme) && styles.authBanner}>
        {profile && profile.kid_theme ? (
          <Image source={kidLogo} style={styles.authKidLogo} />
        ) : (
          <Image source={logoWhite} style={styles.authLogoWhite} />
        )}
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={[styles.mainContainerLight, containerStyle]}>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text
              style={[
                styles.formLabel,
                styles.marginTopMd,
                styles.textCenter,
                styles.textDefaultBold,
              ]}>
              {translate('pin.enter.number')}
            </Text>
            <SmoothPinCodeInput
              password
              value={code}
              onTextChange={(value) => setCode(value)}
              textStyle={styles.formPinText}
              cellStyleFocused={!errorCode && styles.formPinCellFocused}
              containerStyle={styles.formPinContainer}
              cellStyleFilled={styles.formPinCellFilled}
              cellStyle={[
                styles.formPinCell,
                errorCode && styles.formPinCellError,
              ]}
              cellSpacing={10}
              animated={false}
              mask={<View style={styles.formPinCustomMask} />}
              onFulfill={(passCode) => handleLogin(passCode)}
            />
            <TouchableOpacity
              style={[styles.marginTop, styles.flexCenter]}
              onPress={() => navigation.navigate(ROUTES.REGISTER)}>
              <Text style={styles.hyperlink}>{translate('pin.forget')}</Text>
            </TouchableOpacity>
            {dialCode && phoneNumber && (
              <Text
                style={[
                  styles.leadText,
                  styles.textDefault,
                  styles.textCenter,
                  styles.marginTopLg,
                ]}>
                {formatPhoneNumber(dialCode, phoneNumber)}
              </Text>
            )}
            <TouchableOpacity
              style={styles.marginY}
              onPress={() => navigation.navigate(ROUTES.REGISTER)}>
              <Text style={[styles.hyperlink, styles.textCenter]}>
                {translate('phone.login.other.number')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
