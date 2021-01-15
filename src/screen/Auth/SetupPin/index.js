/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import {Text, Button} from 'react-native-elements';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styles from '../../../assets/styles/index';
import {ROUTES} from '../../../variables/constants';
import {
  changePinNumberRequest,
  setupPinNumberRequest,
  setProfileInfo,
} from '../../../store/user/actions';
import {useSelector, useDispatch} from 'react-redux';
import HeaderBar from '../../../components/Common/HeaderBar';
import {getTranslate} from 'react-localize-redux';

const SetupPin = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const phone = useSelector((state) => state.user.phone);
  const accessToken = useSelector((state) => state.user?.accessToken);
  const otpCode = useSelector((state) => state.user.otpCode);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const isPINChanged = route.params?.isPINChanged || false;
  const isLoading = useSelector((state) => state.user.isLoading);

  const handlerSave = async () => {
    if (code && confirmCode) {
      if (code === confirmCode) {
        let result;
        if (isPINChanged) {
          result = await dispatch(
            changePinNumberRequest(code, phone, accessToken),
          );
        } else {
          result = await dispatch(setupPinNumberRequest(code, phone, otpCode));
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
      }
    }
  };

  const handlerReset = () => {
    setCode('');
    setConfirmCode('');
  };

  const disabledConfirm = () => {
    return code.length !== 4 || confirmCode.length !== 4 || isLoading;
  };

  const onCancelOrOnSucceed = () => {
    handlerReset();
    navigation.navigate(ROUTES.USER_PROFILE);
  };

  const onSetProfileInfo = (data) => {
    dispatch(setProfileInfo(data));
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
      <ScrollView style={styles.mainContainerLight}>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text style={styles.formLabel}>{translate('pin.new.number')}</Text>
            <SmoothPinCodeInput
              password
              value={code}
              onTextChange={(value) => setCode(value)}
              animated={false}
              textStyle={styles.formPinText}
              cellSpacing={10}
              containerStyle={styles.formPinContainer}
              cellStyle={styles.formPinCell}
              cellStyleFocused={styles.formPinCellFocused}
              cellStyleFilled={styles.formPinCellFilled}
              mask={<View style={styles.formPinCustomMask} />}
            />
          </View>
        </View>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text style={styles.formLabel}>
              {translate('pin.confirm.number')}
            </Text>
            <SmoothPinCodeInput
              password
              value={confirmCode}
              onTextChange={(value) => setConfirmCode(value)}
              textStyle={styles.formPinText}
              animated={false}
              cellSpacing={10}
              containerStyle={styles.formPinContainer}
              cellStyle={styles.formPinCell}
              cellStyleFocused={styles.formPinCellFocused}
              cellStyleFilled={styles.formPinCellFilled}
              mask={<View style={styles.formPinCustomMask} />}
            />
          </View>
        </View>
        <View style={[styles.paddingMd]}>
          <Button
            title={translate('common.confirm')}
            titleStyle={styles.textUpperCase}
            onPress={() => handlerSave()}
            disabled={disabledConfirm()}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default SetupPin;
