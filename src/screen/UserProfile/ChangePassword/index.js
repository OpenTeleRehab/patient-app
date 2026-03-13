/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Button} from 'react-native-elements';
import {useForm} from 'react-hook-form';
import HeaderBar from '../../../components/Common/HeaderBar';
import TextField from '../../../components/Common/TextField';
import {ROUTES} from '../../../variables/constants';
import styles from '../../../assets/styles';
import {changePasswordRequest} from '../../../store/user/actions';
import AppKeyboardView from '../../../components/Common/AppKeyboardView';

const ChangePassword = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  });

  const onSubmit = (data) => {
    dispatch(changePasswordRequest(data)).then((result) => {
      if (result.success) {
        Alert.alert(
          translate('password.change').toString(),
          translate('success.message.password.changed').toString(),
          [
            {
              text: translate('common.ok').toString(),
              onPress: () => {
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
          translate('password.change').toString(),
          translate('error.message.password.changed').toString(),
          [
            {
              text: translate('common.ok').toString(),
              onPress: () => {},
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    });
  };

  return (
    <>
      <HeaderBar
        title={translate('password.change')}
        onGoBack={() => navigation.navigate(ROUTES.USER_PROFILE)}
      />
      <AppKeyboardView>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainContainerLight}>
          <View style={styles.marginBottomLg}>
            <TextField
              label={translate('password.current')}
              placeholder={translate('password.current.placeholder')}
              variant="filled"
              secureTextEntry
              {...register('current_password', {
                required: translate('error.message.required'),
              })}
              onChangeText={(value) => setValue('current_password', value)}
              errorMessage={errors?.current_password?.message ?? undefined}
              renderErrorMessage={!!errors.current_password}
            />
            <TextField
              label={translate('password.new')}
              placeholder={translate('password.new.placeholder')}
              variant="filled"
              secureTextEntry
              {...register('new_password', {
                required: translate('error.message.required'),
              })}
              onChangeText={(value) => setValue('new_password', value)}
              errorMessage={errors?.new_password?.message ?? undefined}
              renderErrorMessage={!!errors.new_password}
            />
            <TextField
              label={translate('password.confirm_new')}
              placeholder={translate('password.confirm_new.placeholder')}
              variant="filled"
              secureTextEntry
              {...register('confirm_new_password', {
                required: translate('error.message.required'),
                validate: (value) =>
                  value === getValues('new_password') ||
                  translate('error.message.password.not_match'),
              })}
              onChangeText={(value) => setValue('confirm_new_password', value)}
              errorMessage={errors?.confirm_new_password?.message ?? undefined}
              renderErrorMessage={!!errors.confirm_new_password}
            />
          </View>
          <Button
            title={translate('password.change')}
            containerStyle={styles.marginBottom}
            onPress={handleSubmit(onSubmit)}
          />
          <Button
            title={translate('common.cancel')}
            type="outline"
            onPress={() => navigation.navigate(ROUTES.USER_PROFILE)}
            containerStyle={styles.marginBottomMd}
          />
        </ScrollView>
      </AppKeyboardView>
    </>
  );
};

export default ChangePassword;
