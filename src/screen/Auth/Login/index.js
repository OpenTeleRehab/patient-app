/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useContext} from 'react';
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
import {ROUTES} from '../../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import {chatLogout, unSubscribeEvent} from '../../../utils/rocketchat';
import RocketchatContext from '../../../context/RocketchatContext';
import {getCountryRequest} from '../../../store/country/actions';
import formatPhoneNumber from '../../../utils/phoneNumber';
import {getPhoneRequest} from '../../../store/phone/actions';

const containerStyle = {
  height: '100%',
};

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const [code, setCode] = useState('');
  const localize = useSelector((state) => state.localize);
  const {profile} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  const {phone, countryCode, dial_code} = useSelector((state) => state.user);
  const {isChatConnected} = useSelector((state) => state.indicator);
  const {subscribeIds} = useSelector((state) => state.rocketchat);
  const {pin} = useSelector((state) => state.user);
  const [errorCode, setErrorCode] = useState(false);

  useEffect(() => {
    dispatch(getCountryRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isChatConnected && chatSocket !== null) {
      unSubscribeEvent(chatSocket, subscribeIds.roomMessageId);
      unSubscribeEvent(chatSocket, subscribeIds.notifyLoggedId);
      chatLogout(chatSocket, subscribeIds.loginId);
    }
  }, [chatSocket, dispatch, isChatConnected, subscribeIds]);

  const handleLogin = (passCode) => {
    dispatch(getPhoneRequest({phone: phone})).then((result) => {
      if (result) {
        // eslint-disable-next-line no-shadow
        dispatch(loginRequest(phone, passCode, countryCode)).then((result) => {
          if (result.success) {
            if (
              !result.acceptedTermOfService ||
              !result.acceptedPrivacyPolicy
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
        });
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
              <Text style={[styles.fontBase, styles.hyperlink]}>
                {translate('pin.forget')}
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.fontBase,
                styles.leadText,
                styles.textDefault,
                styles.textCenter,
                styles.marginTopLg,
              ]}>
              {formatPhoneNumber(dial_code, phone)}
            </Text>
            <TouchableOpacity
              style={styles.marginY}
              onPress={() => navigation.navigate(ROUTES.REGISTER)}>
              <Text
                style={[styles.fontBase, styles.hyperlink, styles.textCenter]}>
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
