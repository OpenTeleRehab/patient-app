/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Alert, Platform, ToastAndroid} from 'react-native';
import moment from 'moment';
import RNFS from 'react-native-fs';
import {ScrollView} from 'react-native';
import RNLocalize from 'react-native-localize';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES, USER_ROLE} from '../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import HeaderBar from '../../components/Common/HeaderBar';
import {getLanguageRequest} from '../../store/language/actions';
import {useNetInfo} from '@react-native-community/netinfo';
import HealthWorkerProfile from './_Partials/HealthWorkerProfile';
import {getProfessionRequest} from '../../store/profession/actions';
import {getCountryRequest} from '../../store/country/actions';
import PatientProfile from './_Partials/PatientProfile';
import {Button} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {deleteProfileRequest} from '../../store/user/actions';
import {forceLogout} from '../../store/auth/actions';
import {getDownloadDirectoryPath} from '../../utils/fileSystem';
import settings from '../../../config/settings';
import styles from '../../assets/styles';
import {useForm} from 'react-hook-form';

const UserProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {accessToken, registerAs, profile} = useSelector((state) => state.user);
  const {apiBaseURL} = useSelector((state) => state.phone);
  const [downloading, setDownloading] = useState(false);

  const {
    control,
    setValue,
    reset,
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    dispatch(getLanguageRequest());
    dispatch(getProfessionRequest());
    dispatch(getCountryRequest());
  }, [dispatch]);

  useEffect(() => {
    reset({...profile});
  }, [profile, reset, setValue]);

  const handleExport = async () => {
    setDownloading(true);

    const location = await getDownloadDirectoryPath();
    if (location === false) {
      return;
    }

    // Download patient data
    const datetime = moment().format('DDMMYYhhmmss');

    RNFS.downloadFile({
      fromUrl:
        apiBaseURL +
        '/patient/profile/export?timezone=' +
        RNLocalize.getTimeZone(),
      toFile: `${location}/${datetime}_patient_data.zip`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      connectionTimeout: settings.downloadFileReadTimeout,
      readTimeout: settings.downloadFileReadTimeout,
    })
      .promise.then(() => {
        setDownloading(false);
        if (Platform.OS === 'ios') {
          Alert.alert(
            translate('common.download'),
            translate('activity.file_has_been_downloaded_successfully'),
          );
        } else {
          ToastAndroid.show(
            translate('activity.file_has_been_downloaded_successfully'),
            ToastAndroid.SHORT,
          );
        }
      })
      .catch((err) => {
        setDownloading(false);
        if (Platform.OS === 'ios') {
          Alert.alert(translate('common.download'), err);
        } else {
          ToastAndroid.show(err, ToastAndroid.SHORT);
        }
      });
  };

  const handleDelete = () => {
    Alert.alert(
      translate('user.request_to_delete'),
      translate('user.are_you_sure_to_delete'),
      [
        {text: translate('common.yes'), onPress: handleConfirmDelete},
        {text: translate('common.no')},
      ],
    );
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProfileRequest()).then((result) => {
      if (result) {
        Alert.alert(
          translate('user.request_to_delete'),
          translate('user.delete.success'),
          [
            {
              text: translate('common.ok').toString(),
              onPress: () => dispatch(forceLogout()),
            },
          ],
        );
      } else {
        Alert.alert(
          translate('user.request_to_delete'),
          translate('user.delete.failed'),
        );
      }
    });
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={false}
        onGoBack={() => navigation.goBack()}
        title={translate('preferences')}
        rightContent={{
          label: translate('common.edit'),
          onPress: () => netInfo.isConnected && navigation.navigate(ROUTES.USER_PROFILE_EDIT),
        }}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLight}>
        {registerAs === USER_ROLE.HEALTH_WORKER ? (
          <>
            <HealthWorkerProfile control={control} />
            <Button
              type="outline"
              title={translate('pin.change')}
              disabled={!netInfo.isConnected}
              containerStyle={styles.marginBottom}
              buttonStyle={styles.btnOutline}
              onPress={() => navigation.navigate(ROUTES.CONFIRM_PIN)}
            />
            <Button
              title={translate('password.change')}
              disabled={!netInfo.isConnected}
              containerStyle={styles.marginBottom}
              onPress={() => navigation.navigate(ROUTES.CHANGE_PASSWORD)}
            />
          </>
        ) : (
          <>
            <PatientProfile control={control} />
            <Button
              type="outline"
              title={translate('pin.change')}
              disabled={!netInfo.isConnected}
              containerStyle={styles.marginBottomLg}
              buttonStyle={styles.btnOutline}
              onPress={() => navigation.navigate(ROUTES.CONFIRM_PIN)}
            />
            <Button
              title={translate('user.download_my_data')}
              disabled={!netInfo.isConnected}
              containerStyle={styles.marginBottom}
              onPress={handleExport}
            />
            <Button
              title={translate('user.delete')}
              buttonStyle={styles.bgDanger}
              onPress={handleDelete}
              disabled={!netInfo.isConnected}
            />
          </>
        )}
      </ScrollView>
      <Spinner
        visible={downloading}
        textContent={translate('common.downloading')}
        overlayColor="rgba(0, 0, 0, 0.75)"
        textStyle={styles.textLight}
      />
    </>
  );
};

export default UserProfile;
