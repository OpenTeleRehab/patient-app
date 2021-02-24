/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Platform} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const pickerStyles = {
  inputIOS: {
    paddingVertical: 12,
    color: 'black',
  },
  inputAndroid: {
    paddingVertical: 10,
    color: 'black',
  },
  iconContainer: {
    top: Platform.OS === 'android' ? 12 : 10,
  },
  chevron: {display: 'none'},
};

const SelectPicker = (props) => {
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
