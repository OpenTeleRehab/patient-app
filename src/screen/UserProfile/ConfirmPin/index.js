/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Button} from 'react-native-elements';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import HeaderBar from '../../../components/Common/HeaderBar';
import {ROUTES} from '../../../variables/constants';
import styles from '../../../assets/styles';
import {comparePinNumberRequest} from '../../../store/user/actions';

const customStyles = {
  paddingTopXXL: {
    paddingTop: 45,
  },
  marginTopXXL: {
    marginTop: 60,
  },
};

const ConfirmPin = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const accessToken = useSelector((state) => state.user.accessToken);
  const isLoading = useSelector((state) => state.user.isLoading);
  const translate = getTranslate(localize);
  const [pin, setPin] = useState('');

  const disabledConfirm = () => {
    return pin.length !== 4 || isLoading;
  };

  const handleConfirm = () => {
    dispatch(comparePinNumberRequest(pin, accessToken)).then((result) => {
      if (!result) {
        Alert.alert(
          translate('pin.change').toString(),
          translate('error.message.pin.confirmed').toString(),
          [
            {
              text: translate('common.ok').toString(),
              onPress: () => resetPin(),
            },
          ],
          {cancelable: false},
        );
      } else {
        resetPin();
        navigation.navigate(ROUTES.SETUP_PIN, {isPINChanged: true});
      }
    });
  };

  const resetPin = () => {
    setPin('');
  };

  const onCancel = () => {
    resetPin();
    navigation.navigate(ROUTES.USER_PROFILE);
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={true}
        title={translate('pin.confirmation')}
        rightContent={{
          label: translate('common.cancel'),
          onPress: () => onCancel(),
        }}
      />
      <ScrollView
        style={[styles.mainContainerLight, customStyles.paddingTopXXL]}>
        <View style={styles.flexCenter}>
          <>
            <Text style={[styles.formLabel, styles.paddingY]}>
              {translate('pin.confirmation.title')}
            </Text>
            <Text style={styles.formLabel}>
              {translate('pin.enter.number')}
            </Text>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={translate('pin.enter.number')}>
              <SmoothPinCodeInput
                password
                value={pin}
                onTextChange={(value) => setPin(value)}
                animated={false}
                cellSpacing={10}
                textStyle={styles.formPinText}
                containerStyle={styles.formPinContainer}
                cellStyle={styles.formPinCell}
                cellStyleFocused={styles.formPinCellFocused}
                cellStyleFilled={styles.formPinCellFilled}
                mask={<View style={styles.formPinCustomMask} />}
              />
            </TouchableOpacity>
          </>
        </View>
        <View style={[styles.paddingMd, customStyles.marginTopXXL]}>
          <Button
            title={translate('common.confirm')}
            disabled={disabledConfirm()}
            onPress={() => handleConfirm()}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default ConfirmPin;
