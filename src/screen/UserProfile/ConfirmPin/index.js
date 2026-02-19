/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useRef} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Button} from 'react-native-elements';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import HeaderBar from '../../../components/Common/HeaderBar';
import {ROUTES} from '../../../variables/constants';
import styles from '../../../assets/styles';

const customStyles = {
  paddingTopXXL: {
    paddingTop: 45,
  },
  marginTopXXL: {
    marginTop: 60,
  },
};

const ConfirmPin = ({navigation}) => {
  const localize = useSelector((state) => state.localize);
  const {pin, isLoading} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  const [confirmPin, setConfirmPin] = useState('');
  const pinRef = useRef(null);

  const disabledConfirm = () => {
    return pin.length !== 4 || isLoading;
  };

  const handleConfirm = () => {
    if (pin === confirmPin) {
      resetConfirmPin();
      navigation.navigate(ROUTES.SETUP_PIN, {isPINChanged: true});
    } else {
      Alert.alert(
        translate('pin.change').toString(),
        translate('error.message.pin.confirmed').toString(),
        [
          {
            text: translate('common.ok').toString(),
            onPress: () => resetConfirmPin(),
          },
        ],
        {cancelable: false},
      );
    }
  };

  const resetConfirmPin = () => {
    setConfirmPin('');
  };

  const onCancel = () => {
    resetConfirmPin();
    navigation.navigate(ROUTES.USER_PROFILE);
  };

  const handlePinInputPress = (ref) => {
    ref.current?.focus();
  };

  return (
    <>
      <HeaderBar
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
              accessibilityLabel={translate('pin.enter.number')}
              onPress={() => handlePinInputPress(pinRef)}>
              <SmoothPinCodeInput
                ref={pinRef}
                password
                value={confirmPin}
                onTextChange={(value) => setConfirmPin(value)}
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
