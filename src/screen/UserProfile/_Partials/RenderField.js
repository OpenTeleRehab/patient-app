/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Platform, View} from 'react-native';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text} from 'react-native-elements';
import TextField from '../../../components/Common/TextField';
import SelectPicker from '../../../components/Common/SelectPicker';
import styles from '../../../assets/styles';
import {Controller} from 'react-hook-form';
import DatePicker from '../../../components/Common/DatePicker';
import moment from 'moment/moment';
import {formatDate} from '../../../utils/helper';

const RenderField = ({control, field, error}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(field.value);

  if (field.type === 'datepicker') {
    return (
      <Controller
        control={control}
        name={field.name}
        rules={field.rules}
        render={({ field: { onChange } }) => {
          return (
            <DatePicker
              label={translate('date.of.birth')}
              value={dateValue}
              mode="date"
              onSetDate={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  onChange(formatDate(selectedDate));
                  setDateValue(moment(selectedDate).toDate());
                }
              }}
              show={showDatePicker}
              onClickIcon={() => setShowDatePicker(true)}
            />
          );
        }}
      />
    );
  } else if (field.type === 'select') {
    return (
      <>
        <Text
          accessibilityLabel={translate(field.label)}
          style={styles.formLabel}
        >
          {translate(field.label)}
        </Text>
        <View
          style={styles.formSelectPickerContainer}
        >
          <Controller
            control={control}
            name={field.name}
            render={({ field: { value, onChange } }) => (
              <SelectPicker
                placeholder={{}}
                disabled={field.disabled}
                value={value}
                items={field?.items ?? []}
                onValueChange={onChange}
                accessibilityLabel={translate(field.label)}
              />
            )}
            rules={field.rules}
          />
        </View>
      </>
    );
  } else {
    return (
      <Controller
        control={control}
        name={field.name}
        rules={field.rules}
        render={({ field: { value, onChange } }) => (
          <TextField
            label={translate(field.label)}
            variant="filled"
            disabled={field.disabled}
            value={value}
            onChangeText={onChange}
            rightIcon={field.rightIcon}
            errorMessage={error ? error.message : undefined}
            renderErrorMessage={!!error}
          />
        )}
      />
    );
  }
};

export default RenderField;
