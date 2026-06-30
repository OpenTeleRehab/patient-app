/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Platform} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import colors from '../../../assets/styles/variables/colors';

const PickerSelectIcon = () => <FAIcon name="caret-down" size={20} />;

const SelectPicker = (props) => {
  const selectedItem = props.items.find((item) => item.value === props.value);

  const fontSize = props.customeFontSize ?? 17;

  const inputStyle = {
    color: colors.black,
    fontSize: fontSize,
    paddingVertical: Platform.OS === 'android' ? 10 : 12,
  };

  const pickerSelectStyle = {
    placeholder: {
      fontSize: fontSize,
    },
    inputIOSContainer: {
      overflow: 'hidden',
    },
    inputIOS: inputStyle,
    inputAndroid: inputStyle,
    iconContainer: {
      top: Platform.OS === 'android' ? 12 : 10,
    },
  };

  return (
    <RNPickerSelect
      fixAndroidTouchableBug
      useNativeAndroidPickerStyle={false}
      Icon={PickerSelectIcon}
      touchableWrapperProps={{
        accessible: true,
        accessibilityLabel: selectedItem?.label,
      }}
      pickerProps={{
        accessibilityLabel: selectedItem?.label,
        itemStyle: {
          color: colors.black,
        },
      }}
      style={pickerSelectStyle}
      {...props}
    />
  );
};

export default SelectPicker;
