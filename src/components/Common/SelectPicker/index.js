/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Platform} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

const pickerStyles = {
  inputIOS: {
    paddingVertical: 10,
    color: 'black',
    fontSize: 17,
  },
  inputAndroid: {
    paddingVertical: 10,
    color: 'black',
    fontSize: 17,
  },
  iconContainer: {
    top: Platform.OS === 'android' ? 12 : 10,
  },
  chevron: {display: 'none'},
};

const iconRenderer = () => <FAIcon name="caret-down" size={20} />;

const SelectPicker = (props) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <RNPickerSelect
      fixAndroidTouchableBug
      useNativeAndroidPickerStyle={false}
      Icon={() => iconRenderer()}
      style={pickerStyles}
      {...props}
      touchableWrapperProps={{
        accessible: true,
        accessibilityLabel: translate('common.dropdown'),
      }}
    />
  );
};

export default SelectPicker;
