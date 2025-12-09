/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {Text} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import RenderField from './RenderField';
import {isValidDateFormat} from '../../../utils/helper';
import formatPhoneNumber from '../../../utils/phoneNumber';
import {ageCalculation} from '../../../utils/age';
import moment from 'moment/moment';
import TextField from '../../../components/Common/TextField';
import styles from '../../../assets/styles';

const PatientProfile = ({control, errors, editable}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {languages} = useSelector((state) => state.language);
  const {dial_code, phone, profile} = useSelector((state) => state.user);

  const date_of_birth = isValidDateFormat(profile.date_of_birth)
    ? profile.date_of_birth
    : moment(profile.date_of_birth).toDate();

  const fields = [
    {
      name: 'first_name',
      label: 'first.name',
      rules: {
        required: translate('error.message.required'),
      },
      disabled: !editable,
      type: 'text',
    },
    {
      name: 'last_name',
      label: 'last.name',
      rules: {
        required: translate('error.message.required'),
      },
      disabled: !editable,
      type: 'text',
    },
    {
      name: 'gender',
      label: 'common.gender',
      disabled: !editable,
      items: [
        { label: translate('gender.male'), value: 'male' },
        { label: translate('gender.female'), value: 'female' },
        { label: translate('gender.other'), value: 'other' },
      ],
      type: 'select',
    },
    {
      name: 'date_of_birth',
      label: 'date.of.birth',
      value: date_of_birth,
      disabled: !editable,
      helperText: (
        <Text>
          {translate('age.dob', { value: ageCalculation(date_of_birth, translate) })}
        </Text>
      ),
      type: 'datepicker',
    },
    {
      name: 'language',
      label: 'common.language',
      disabled: !editable,
      items: languages.map(language => ({
        label: language.name,
        value: language.id,
      })),
      type: 'select',
    },
  ];

  return (
    <>
      {fields.map((field, index) => (
        <>
          <RenderField
            key={index}
            control={control}
            field={field}
            error={errors ? errors[field.name] : null}
          />
          {field.helperText && (
            <Text style={styles.marginBottomMd}>
              {field.helperText}
            </Text>
          )}
        </>
      ))}
      <TextField
        disabled
        label={translate('phone.number')}
        variant="filled"
        value={formatPhoneNumber(dial_code, phone)}
        renderErrorMessage={false}
      />
    </>
  );
};

export default PatientProfile;
