/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text} from 'react-native-elements';
import TextField from '../../../components/Common/TextField';
import SelectPicker from '../../../components/Common/SelectPicker';
import styles from '../../../assets/styles';
import {Controller} from 'react-hook-form';
import DatePicker from '../../../components/Common/DatePicker';
import moment from 'moment/moment';
import {formatDate, isValidDateFormat} from '../../../utils/helper';
import {ageCalculation} from '../../../utils/age';

const RenderField = ({control, field, error}) => {
  const localize = useSelector((state) => state.localize);
  const {profile} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  const [dateValue, setDateValue] = useState(field.value);

  if (field.type === 'datepicker') {
    if (field.disabled) {
      const date_of_birth = isValidDateFormat(profile.date_of_birth)
        ? profile.date_of_birth
        : formatDate(profile.date_of_birth);

      return (
        <TextField
          label={translate(field.label)}
          variant="filled"
          disabled={field.disabled}
          value={date_of_birth}
          rightIcon={
            <Text>
              {translate('age.dob', {value: ageCalculation(date_of_birth, translate)})}
            </Text>
          }
          errorMessage={error ? error.message : undefined}
          renderErrorMessage={!!error}
        />
      )
    }

    return (
      <Controller
        control={control}
        name={field.name}
        rules={field.rules}
        render={({field: {onChange}}) => {
          return (
            <DatePicker
              label={translate('date.of.birth')}
              value={dateValue}
              disabled={field.disabled}
              onSetDate={(value) => {
                onChange(formatDate(value));
                setDateValue(moment(value).toDate());
              }}
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
          style={styles.formLabel}>
          {translate(field.label)}
        </Text>
        <View style={styles.formSelectPickerContainer}>
          <Controller
            control={control}
            name={field.name}
            render={({field: {value, onChange}}) => (
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
        render={({field: {value, onChange}}) => (
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
