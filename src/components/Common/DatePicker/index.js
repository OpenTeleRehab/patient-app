/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatDate} from '../../../utils/helper';
import styles from '../../../assets/styles';

const DatePicker = (props) => {
  const {label, value, mode, onSetDate, show, onClickIcon} = props;

  return (
    <>
      <Input
        disabled
        label={label}
        value={value ? formatDate(value) : ''}
        rightIcon={{
          name: 'calendar-today',
          type: 'material-community',
          color: '#575757',
          onPress: () => onClickIcon(),
        }}
        labelStyle={componentStyles.labelStyle}
        containerStyle={componentStyles.containerStyle}
        inputContainerStyle={componentStyles.inputContainerStyle}
        disabledInputStyle={componentStyles.disabledInputStyle}
        renderErrorMessage={false}
      />
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onSetDate}
          style={Platform.OS === 'ios' ? styles.dateTimePickerContainer : null}
        />
      )}
    </>
  );
};

const componentStyles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  inputContainerStyle: {
    backgroundColor: '#E6E8EA',
    borderRadius: 6,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
  },
  labelStyle: {
    color: '#333333',
    fontSize: 14,
    fontWeight: 400,
    marginBottom: 8,
  },
  disabledInputStyle: {
    opacity: 1,
  },
  errorStyle: {
    marginHorizontal: 0,
  },
});

export default DatePicker;
