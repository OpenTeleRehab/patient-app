/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Platform, I18nManager} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const SelectPicker = (props) => {
  const textAlign = I18nManager.isRTL ? 'right' : 'left';

  const pickerStyles = {
    inputIOS: {
      paddingVertical: 10,
      color: 'black',
      fontSize: 17,
      textAlign: textAlign,
    },
    inputAndroid: {
      paddingVertical: 10,
      color: 'black',
      fontSize: 17,
      textAlign: textAlign,
    },
    iconContainer: {
      top: Platform.OS === 'android' ? 12 : 10,
    },
    chevron: {display: 'none'},
  };

  return (
    <RNPickerSelect
      fixAndroidTouchableBug
      useNativeAndroidPickerStyle={false}
      Icon={() => <FAIcon name="caret-down" size={20} />}
      style={pickerStyles}
      {...props}
    />
  );
};

export default SelectPicker;
