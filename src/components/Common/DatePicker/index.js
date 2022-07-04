/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {View} from 'react-native';
import {Input, Divider} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatDate} from '../../../utils/helper';
import styles from '../../../assets/styles';

const DatePicker = (props) => {
  const {label, value, mode, onSetDate, show, onClickIcon} = props;

  return (
    <>
      <View style={styles.formGroup}>
        <Input
          label={label}
          labelStyle={[styles.formLabel, styles.textSmall]}
          disabled
          value={value ? formatDate(value) : ''}
          rightIcon={{
            name: 'calendar-today',
            type: 'material-community',
            color: '#575757',
            onPress: () => onClickIcon(),
            size: 28,
          }}
          containerStyle={styles.formControlDate}
          inputContainerStyle={styles.noneBorderBottom}
          disabledInputStyle={styles.formControlDateInput}
        />
        <Divider />
      </View>
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onSetDate}
        />
      )}
    </>
  );
};

export default DatePicker;
