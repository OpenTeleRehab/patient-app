/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {useSelector} from 'react-redux';
import RenderField from './RenderField';
import {getLanguageName} from '../../../utils/language';

const HealthWorkerProfile = ({control, errors, editable}) => {
  const {languages} = useSelector((state) => state.language);
  const {professions} = useSelector((state) => state.profession);
  const {countries} = useSelector((state) => state.country);
  const {clinic} = useSelector((state) => state.clinic);
  const {profile} = useSelector((state) => state.user);

  const fields = [
    {
      name: 'first_name',
      label: 'first.name',
      value: profile?.first_name,
      disabled: !editable,
      type: 'text',
    },
    {
      name: 'last_name',
      label: 'last.name',
      value: profile?.last_name,
      disabled: !editable,
      type: 'text',
    },
    {
      name: 'email',
      label: 'common.email',
      value: profile.email,
      disabled: true,
      type: 'text',
    },
    {
      name: 'profession_id',
      label: 'common.profession',
      value: profile.profession_id,
      disabled: !editable,
      items: professions.map((profession) => ({
        label: profession.name,
        value: profession.id,
      })),
      type: 'select',
    },
    {
      name: 'country_id',
      label: 'common.country',
      value: profile.country_id,
      disabled: true,
      items: countries.map((country) => ({
        label: country.name,
        value: country.id,
      })),
      type: 'select',
    },
    {
      name: 'clinic_id',
      label: 'common.clinic',
      value: profile.clinic_id,
      disabled: true,
      items: [{label: clinic?.name, value: clinic?.id}],
      type: 'select',
    },
    {
      name: 'language_id',
      label: 'common.language',
      value: getLanguageName(profile.language_id, languages),
      disabled: !editable,
      items: languages.map((language) => ({
        label: language.name,
        value: language.id,
      })),
      type: 'select',
    },
  ];

  return (
    <>
      {fields.map((field, index) => (
        <RenderField
          key={index}
          control={control}
          field={field}
          error={errors ? errors[field.name] : null}
        />
      ))}
    </>
  );
};

export default HealthWorkerProfile;
