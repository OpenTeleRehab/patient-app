/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState, useRef, useContext} from 'react';
import {ScrollView, View, Alert, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styles from '../../../assets/styles/index';
import {ROUTES} from '../../../variables/constants';
import {
  changePinNumberRequest,
  setupPinNumberRequest,
  setProfileInfo,
  generateFirebaseToken,
} from '../../../store/user/actions';
import {useSelector, useDispatch} from 'react-redux';
import HeaderBar from '../../../components/Common/HeaderBar';
import {getTranslate} from 'react-localize-redux';
import {clearRegister} from '../../../store/register/actions';
import RocketchatContext from '../../../context/RocketchatContext';
import {chatLogout, unSubscribeEvent} from '../../../utils/rocketchat';

const SetupPin = ({navigation, route}) => {
  const chatSocket = useContext(RocketchatContext);
  const dispatch = useDispatch();
  const {subscribeIds, chatAuth} = useSelector((state) => state.rocketchat);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const isPINChanged = route.params?.isPINChanged || false;
  const [errorCode, setErrorCode] = useState(false);

  const codeInputRef = useRef(null);
  const confirmCodeInputRef = useRef(null);

  const handlerSave = async (passCode) => {
    if (code && passCode) {
      if (code === passCode) {
        let result;

        if (isPINChanged) {
          result = await dispatch(changePinNumberRequest(code));
        } else {
          result = await dispatch(setupPinNumberRequest(code));
        }

        if (result.success) {
          Alert.alert(
            translate('pin.setup.number').toString(),
            translate('success.message.pin.setup').toString(),
            [
              {
                text: translate('common.ok').toString(),
                onPress: () =>
                  isPINChanged
                    ? onCancelOrOnSucceed()
                    : onSetProfileInfo(result.data),
              },
            ],
            {cancelable: false},
          );
        } else if (result.errorCode === 'ERR_NETWORK' || result.errorCode === 'ECONNABORTED') {
            Alert.alert(
              translate('pin.setup.number').toString(),
              translate('error.message.network.error').toString(),
              [
                {
                  text: translate('common.retry').toString(),
                  onPress: () => handlerSave(passCode),
                },
              ],
              {cancelable: false},
            );
        } else {
          Alert.alert(
            translate('pin.setup.number').toString(),
            translate('error.message.internal.server').toString(),
            [
              {
                text: translate('common.ok').toString(),
                onPress: () => handlerReset(),
              },
            ],
            {cancelable: false},
          );
        }
      } else {
        Alert.alert(
          translate('pin.setup.number').toString(),
          translate('error.message.pin.setup.not.match').toString(),
          [
            {
              text: translate('common.ok').toString(),
              onPress: () => handlerReset(),
            },
          ],
          {cancelable: false},
        );
        setErrorCode(true);
      }
    }
  };

  const handlerReset = () => {
    setCode('');
    setConfirmCode('');
  };

  const onCancelOrOnSucceed = () => {
    handlerReset();
    navigation.navigate(ROUTES.USER_PROFILE);
  };

  const onSetProfileInfo = (data) => {
    if (chatSocket && chatAuth?.userId && subscribeIds?.loginId) {
      // Unsubscribe from websocket
      unSubscribeEvent(chatSocket, subscribeIds.loginId);

      // Logout from rocket chat
      chatLogout(chatSocket, chatAuth.userId);
    }

    // Clear register information
    dispatch(clearRegister());

    // Set user profile information
    dispatch(setProfileInfo(data));

    // Generate firebase token
    dispatch(generateFirebaseToken(data.token));
  };

  const handleCodeInputPress = (ref) => {
    ref.current?.focus();
  };

  return (
    <>
      <HeaderBar
        onGoBack={isPINChanged ? null : () => navigation.goBack()}
        title={translate('pin.setup.number')}
        rightContent={
          isPINChanged
            ? {
                label: translate('common.cancel'),
                onPress: () => onCancelOrOnSucceed(),
              }
            : null
        }
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.mainContainerLight}>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View
            style={[styles.paddingY, styles.marginTopMd, styles.marginBottom]}>
            <Text
              accessibilityLabel={translate('pin.setup.title')}
              style={styles.formLabel}>
              {translate('pin.setup.title')}
            </Text>
          </View>
          <View>
            <Text
              accessibilityLabel={translate('pin.new.number')}
              style={styles.formLabel}>
              {translate('pin.new.number')}
            </Text>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={translate('enter.pin.new.number')}
              onPress={() => handleCodeInputPress(codeInputRef)}
            >
              <SmoothPinCodeInput
                ref={codeInputRef}
                password
                value={code}
                onTextChange={(value) => setCode(value)}
                animated={false}
                textStyle={styles.formPinText}
                cellSpacing={10}
                containerStyle={styles.formPinContainer}
                cellStyle={[
                  styles.formPinCell,
                  errorCode && styles.formPinCellError,
                ]}
                cellStyleFocused={!errorCode && styles.formPinCellFocused}
                cellStyleFilled={styles.formPinCellFilled}
                mask={<View style={styles.formPinCustomMask} />}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text
              accessibilityLabel={translate('pin.confirm.number')}
              style={styles.formLabel}>
              {translate('pin.confirm.number')}
            </Text>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={translate('enter.pin.confirm.number')}
              onPress={() => handleCodeInputPress(confirmCodeInputRef)}
            >
              <SmoothPinCodeInput
                ref={confirmCodeInputRef}
                password
                value={confirmCode}
                onTextChange={(value) => setConfirmCode(value)}
                textStyle={styles.formPinText}
                animated={false}
                cellSpacing={10}
                containerStyle={styles.formPinContainer}
                cellStyle={[
                  styles.formPinCell,
                  errorCode && styles.formPinCellError,
                ]}
                cellStyleFocused={!errorCode && styles.formPinCellFocused}
                cellStyleFilled={styles.formPinCellFilled}
                mask={<View style={styles.formPinCustomMask} />}
                editable={code.length === 4}
                onFulfill={(passCode) => handlerSave(passCode)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default SetupPin;
