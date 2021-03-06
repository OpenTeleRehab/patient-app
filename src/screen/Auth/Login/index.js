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
import {Button, Text} from 'react-native-elements';
import {
  loginRequest,
  fetchTermOfServiceRequest,
  generateFakeAccessToken,
  fetchPrivacyPolicyRequest,
} from '../../../store/user/actions';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {ROUTES} from '../../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import {chatLogout, unSubscribeEvent} from '../../../utils/rocketchat';
import RocketchatContext from '../../../context/RocketchatContext';
import {getCountryRequest} from '../../../store/country/actions';
import formatPhoneNumber from '../../../utils/phoneNumber';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const [code, setCode] = useState('');
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {phone, countryCode, dial_code, isLoading} = useSelector(
    (state) => state.user,
  );
  const {isChatConnected} = useSelector((state) => state.indicator);
  const {subscribeIds} = useSelector((state) => state.rocketchat);
  const {pin} = useSelector((state) => state.user);

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

  const handleLogin = () => {
    dispatch(loginRequest(phone, code, countryCode)).then((result) => {
      if (result.success) {
        if (!result.acceptedTermOfService || !result.acceptedPrivacyPolicy) {
          navigation.navigate(ROUTES.TERM_OF_SERVICE);
        }
      } else {
        if (code === pin) {
          dispatch(generateFakeAccessToken());
        } else {
          Alert.alert(
            translate('common.login.fail'),
            translate('wrong.pin'),
            [{text: translate('common.ok'), onPress: () => reset()}],
            {cancelable: false},
          );
        }
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
    <SafeAreaView style={styles.bgBlack}>
      <View style={styles.authBanner}>
        <Image source={logoWhite} style={styles.authLogoWhite} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.mainContainerLight}>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text style={styles.formLabel}>{translate('phone.number')}</Text>
            <Text style={[styles.leadText, styles.textDefault]}>
              {formatPhoneNumber(dial_code, phone)}
            </Text>
            <TouchableOpacity
              style={styles.marginY}
              onPress={() => navigation.navigate(ROUTES.REGISTER)}>
              <Text style={styles.hyperlink}>
                {translate('phone.login.other.number')}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.formLabel, styles.marginTopMd]}>
              {translate('pin.enter.number')}
            </Text>
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
              <Text style={styles.hyperlink}>{translate('pin.forget')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.paddingMd}>
          <Button
            onPress={() => handleLogin()}
            title={translate('common.login')}
            titleStyle={styles.textUpperCase}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
