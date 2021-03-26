/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useCallback, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Image, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {
  loginRequest,
  fetchTermOfServiceRequest,
} from '../../../store/user/actions';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {getLocalData} from '../../../utils/local_storage';
import {ROUTES, STORAGE_KEY} from '../../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import {chatLogout, unSubscribeEvent} from '../../../utils/rocketchat';
import RocketchatContext from '../../../context/RocketchatContext';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const isLoading = useSelector((state) => state.user.isLoading);
  const {isChatConnected} = useSelector((state) => state.indicator);
  const {subscribeIds} = useSelector((state) => state.rocketchat);

  useEffect(() => {
    if (isChatConnected) {
      unSubscribeEvent(chatSocket, subscribeIds.roomMessageId);
      unSubscribeEvent(chatSocket, subscribeIds.notifyLoggedId);
      chatLogout(chatSocket, subscribeIds.loginId);
    }
  }, [chatSocket, dispatch, isChatConnected, subscribeIds]);

  const fetchLocalData = useCallback(async () => {
    const data = await getLocalData(STORAGE_KEY.AUTH_INFO, true);
    if (data) {
      setPhone(data.phone);
    }
  }, []);

  const handleLogin = () => {
    dispatch(loginRequest(phone, code)).then((result) => {
      if (result.success) {
        if (!result.acceptedTermOfService) {
          navigation.navigate(ROUTES.TERM_OF_SERVICE);
        }
      } else {
        Alert.alert(
          translate('common.login.fail'),
          translate('wrong.pin'),
          [{text: translate('common.ok'), onPress: () => reset()}],
          {cancelable: false},
        );
      }
    });
  };

  const reset = () => {
    setCode('');
  };

  useEffect(() => {
    fetchLocalData();
  }, [fetchLocalData]);

  useEffect(() => {
    dispatch(fetchTermOfServiceRequest());
  }, [dispatch]);

  return (
    <>
      <View style={styles.authBanner}>
        <Image source={logoWhite} style={styles.authLogoWhite} />
      </View>
      <ScrollView style={styles.mainContainerLight}>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text style={styles.formLabel}>{translate('phone.number')}</Text>
            <Text style={[styles.leadText, styles.textDark]}>+{phone}</Text>
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
    </>
  );
};

export default Login;
