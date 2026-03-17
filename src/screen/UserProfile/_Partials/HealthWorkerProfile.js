/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RenderField from './RenderField';
import {getPhcServicesRequest} from '../../../store/phcService/actions';

const HealthWorkerProfile = ({control, errors, editable}) => {
  const dispatch = useDispatch();
  const {languages} = useSelector((state) => state.language);
  const {professions} = useSelector((state) => state.profession);
  const {countries} = useSelector((state) => state.country);
  const {profile} = useSelector((state) => state.user);
  const {phcServices} = useSelector((state) => state.phcService);

  const [phcService, setPhcService] = useState(undefined);

  useEffect(() => {
    dispatch(getPhcServicesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (phcServices.length) {
      setPhcService(
        phcServices.find((item) => item.id === profile.phc_service_id),
      );
    }
  }, [phcServices, profile.phc_service_id]);

  const fields = [
    {
      name: 'first_name',
      label: 'first.name',
      disabled: !editable,
      type: 'text',
    },
    {
      name: 'last_name',
      label: 'last.name',
      disabled: !editable,
      type: 'text',
    },
    {
      name: 'email',
      label: 'common.email',
      disabled: true,
      type: 'text',
    },
    {
      name: 'profession_id',
      label: 'common.profession',
      disabled: true,
      items: professions.map((profession) => ({
        label: profession.name,
        value: profession.id,
      })),
      type: 'select',
    },
    {
      name: 'country_id',
      label: 'common.country',
      disabled: true,
      items: countries.map((country) => ({
        label: country.name,
        value: country.id,
      })),
      type: 'select',
    },
    {
      name: 'phc_service_id',
      label: 'phc.patient.phc_service',
      disabled: true,
      items: [
        {
          label: phcService?.name,
          value: phcService?.id,
        },
      ],
      type: 'select',
    },
    {
      name: 'language_id',
      label: 'common.language',
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
