/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Platform, StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import {formatDate, formatTime} from '../../../utils/helper';
import colors from '../../../assets/styles/variables/colors';

const DatePicker = (props) => {
  const {
    label,
    value,
    disabled,
    placeholder,
    mode = 'date',
    maximumDate,
    minimumDate,
    is24Hour,
    labelStyle,
    inputStyle,
    inputContainerStyle,
    onSetDate,
  } = props;

  const [showPicker, setShowPicker] = useState(false);

  const rightIcon = {
    name: mode === 'time' ? 'clock-outline' : 'calendar-month',
    type: 'material-community',
    color: disabled ? colors.grey : colors.grey1,
    disabled: disabled,
    disabledStyle: {
      backgroundColor: 'transparent',
    },
    onPress: () => setShowPicker(!showPicker),
  };

  const onChange = (event, selectedDate) => {
    // Check if the user canceled
    if (event === 'dismissed') {
      // Logic for when the user clicks 'Cancel' or dismisses the picker
      setShowPicker(false);
      return false;
    }
    setShowPicker(Platform.OS === 'ios'); // On iOS, keep the picker open if desired
    onSetDate(selectedDate);
  };

  return (
    <>
      <Input
        disabled={true}
        accessible={true}
        accessibilityLabel={label}
        label={label}
        placeholder={placeholder}
        value={
          value ? (mode === 'date' ? formatDate(value) : formatTime(value)) : ''
        }
        labelStyle={labelStyle ? labelStyle : componentStyles.labelStyle}
        rightIcon={rightIcon}
        inputStyle={inputStyle}
        containerStyle={componentStyles.containerStyle}
        inputContainerStyle={{
          ...componentStyles.inputContainerStyle,
          ...inputContainerStyle,
        }}
        disabledInputStyle={componentStyles.disabledInputStyle}
        renderErrorMessage={false}
      />
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          is24Hour={is24Hour ?? true}
          display="default"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={onChange}
          style={Platform.OS === 'ios' && componentStyles.dateTimePicker}
        />
      )}
    </>
  );
};

const componentStyles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  labelStyle: {
    color: '#333333',
    fontSize: 14,
    fontWeight: 400,
    marginBottom: 8,
  },
  inputContainerStyle: {
    backgroundColor: '#E6E8EA',
    borderRadius: 6,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
  },
  dateTimePicker: {
    height: 50,
  },
  disabledInputStyle: {
    opacity: 1,
  },
});

export default DatePicker;
