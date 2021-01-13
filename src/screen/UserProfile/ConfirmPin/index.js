/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Button} from 'react-native-elements';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import HeaderBar from '../../../components/Common/HeaderBar';
import {ROUTES} from '../../../variables/constants';
import styles from '../../../assets/styles';

const customStyles = {
  paddingTopXXL: {
    paddingTop: 60,
  },
  marginTopXXL: {
    marginTop: 60,
  },
};

const ConfirmPin = ({navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [pin, setPin] = useState('');

  const disabledConfirm = () => {
    return pin.length !== 4;
  };

  const handleConfirm = () => {
    setPin('');
    navigation.navigate(ROUTES.SETUP_PIN, {isPINChanged: true});
  };

  return (
    <>
      <HeaderBar
        title={translate('pin.confirmation')}
        rightContent={{
          label: translate('common.cancel'),
          onPress: () => navigation.navigate(ROUTES.USER_PROFILE),
        }}
      />
      <ScrollView
        style={[styles.mainContainerLight, customStyles.paddingTopXXL]}>
        <View style={styles.flexCenter}>
          <>
            <Text style={styles.formLabel}>Enter PIN number</Text>
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
          </>
        </View>
        <View style={[styles.paddingMd, customStyles.marginTopXXL]}>
          <Button
            title={translate('common.confirm')}
            titleStyle={styles.textUpperCase}
            disabled={disabledConfirm()}
            onPress={() => handleConfirm()}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default ConfirmPin;
