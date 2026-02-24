/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useCallback} from 'react';
import {Alert, Keyboard, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES, STORAGE_KEY, USER_ROLE} from '../../variables/constants';
import HeaderBar from '../../components/Common/HeaderBar';
import {getTranslate} from 'react-localize-redux';
import HealthWorkerProfile from './_Partials/HealthWorkerProfile';
import PatientProfile from './_Partials/PatientProfile';
import {useForm} from 'react-hook-form';
import {Button} from 'react-native-elements';
import {updateProfileRequest} from '../../store/user/actions';
import {getTranslations} from '../../store/translation/actions';
import {storeLocalData} from '../../utils/local_storage';
import {useNetInfo} from '@react-native-community/netinfo';
import {formatDate, isValidDateFormat} from '../../utils/helper';
import styles from '../../assets/styles';

const UserProfileEdit = ({navigation}) => {
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {languages} = useSelector((state) => state.language);
  const {profile, registerAs} = useSelector((state) => state.user);

  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: {isDirty, errors},
  } = useForm({
    defaultValues: {},
  });

  const handleReset = useCallback(() => {
    if (profile) {
      if (registerAs === USER_ROLE.HEALTH_WORKER) {
        reset(
          {
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            profession_id: profile.profession_id,
            country_id: profile.country_id,
            phc_service_id: profile.phc_service_id,
            language_id: profile.language_id,
            language_code: profile.language_code,
            show_guidance: profile.show_guidance,
          },
          {
            keepDirtyValues: false,
          },
        );
      } else {
        const date_of_birth = isValidDateFormat(profile.date_of_birth)
          ? profile.date_of_birth
          : formatDate(profile.date_of_birth);

        reset(
          {
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone: profile.phone,
            gender: profile.gender,
            date_of_birth: date_of_birth,
            language_id: profile.language_id,
            therapist_id: profile.therapist_id,
          },
          {
            keepDirtyValues: false,
          },
        );
      }
    }
  }, [profile, registerAs, reset]);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  useEffect(() => {
    const subscription = watch((value, {name}) => {
      if (name === 'language_id') {
        const language = languages.find(
          (item) => item.id === value.language_id,
        );

        if (language) {
          setValue('language_code', language.code);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [languages, setValue, watch]);

  const handleGoBack = () => {
    Keyboard.dismiss();

    if (isDirty) {
      Alert.alert(
        translate('edit.profile.title').toString(),
        translate('edit.profile.discard.message').toString(),
        [
          {
            text: translate('common.cancel').toString(),
            style: 'cancel',
          },
          {
            text: translate('common.ok').toString(),
            onPress: () => {
              navigation.navigate(ROUTES.USER_PROFILE);
            },
          },
        ],
      );
    } else {
      navigation.navigate(ROUTES.USER_PROFILE);
    }
  };

  const onSubmit = (data) => {
    dispatch(updateProfileRequest(data)).then((result) => {
      if (result) {
        Alert.alert(
          translate('edit.profile.title').toString(),
          translate('success.message.edit.profile').toString(),
          [
            {
              text: translate('common.ok').toString(),
              onPress: async () => {
                dispatch(getTranslations(data.language_id));
                await storeLocalData(STORAGE_KEY.LANGUAGE, data.language_id);
                navigation.navigate(ROUTES.USER_PROFILE);
              },
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        Alert.alert(
          translate('edit.profile.title').toString(),
          translate('error.message.edit.profile').toString(),
          [
            {
              text: translate('common.ok').toString(),
              onPress: () => {},
            },
          ],
          {cancelable: false},
        );
      }
    });
  };

  return (
    <>
      <HeaderBar
        onGoBack={handleGoBack}
        title={translate('edit.profile.title')}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainerLight}
      >
        {registerAs === USER_ROLE.HEALTH_WORKER ? (
          <HealthWorkerProfile
            control={control}
            errors={errors}
            editable={true}
          />
        ) : (
          <PatientProfile
            control={control}
            errors={errors}
            editable={true}
          />
        )}

        <Button
          title={translate('common.save')}
          onPress={handleSubmit(onSubmit)}
          disabled={!netInfo.isConnected || !isDirty}
        />
      </ScrollView>
    </>
  );
};
export default UserProfileEdit;
