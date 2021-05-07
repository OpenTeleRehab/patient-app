/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Button, ListItem, Text} from 'react-native-elements';
import {
  Alert,
  Platform,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../../assets/styles';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import HeaderBar from '../../components/Common/HeaderBar';
import {formatDate, isValidDateFormat} from '../../utils/helper';
import {getLanguageName} from '../../utils/language';
import {getLanguageRequest} from '../../store/language/actions';
import {deleteProfileRequest} from '../../store/user/actions';
import {forceLogout} from '../../store/auth/actions';
import {getDownloadDirectoryPath} from '../../utils/fileSystem';
import RNFS from 'react-native-fs';
import {ageCalculation} from '../../utils/age';
import settings from '../../../config/settings';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNetInfo} from '@react-native-community/netinfo';

const UserProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile, accessToken} = useSelector((state) => state.user);
  const {languages} = useSelector((state) => state.language);
  const [downloading, setDownloading] = useState(false);
  const dob = isValidDateFormat(profile.date_of_birth)
    ? profile.date_of_birth
    : formatDate(profile.date_of_birth);
  const netInfo = useNetInfo();

  const userInfo = [
    {
      label: 'common.name',
      value: profile.last_name + ' ' + profile.first_name,
    },
    {
      label: 'common.gender',
      value: profile.gender ? translate(`gender.${profile.gender}`) : '',
    },
    {
      label: 'date.of.birth',
      value: dob,
      rightContentValue: 'Age: ' + ageCalculation(dob, translate),
    },
    {
      label: 'phone.number',
      value: `+${profile.phone}`,
    },
    {
      label: 'common.language',
      value: getLanguageName(profile.language_id, languages),
    },
  ];

  useEffect(() => {
    dispatch(getLanguageRequest());
  }, [dispatch]);

  const handleExport = async () => {
    const location = await getDownloadDirectoryPath();
    if (location === false) {
      return;
    }

    setDownloading(true);
    RNFS.downloadFile({
      fromUrl: settings.apiBaseURL + '/patient/profile/export',
      toFile: `${location}/patient_data.zip`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).promise.then(() => {
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

  const RenderListItem = (user) => {
    return (
      <>
        <ListItem bottomDivider containerStyle={styles.listBackground}>
          <ListItem.Content>
            <ListItem.Title>
              {translate(user.label).toLocaleUpperCase()}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title style={styles.fontWeightBold}>
              {user.value}
            </ListItem.Title>
          </ListItem.Content>
          <Text style={styles.listStyle}>{user.rightContentValue}</Text>
        </ListItem>
      </>
    );
  };

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.navigate(ROUTES.HOME)}
        title={translate('preferences')}
        rightContent={{
          label: translate('common.edit'),
          onPress: () =>
            netInfo.isConnected &&
            navigation.navigate(ROUTES.USER_PROFILE_EDIT),
        }}
      />
      <ScrollView>
        <View style={styles.mainContainerLight}>
          {userInfo.map((user, index) => (
            <RenderListItem {...user} key={index} />
          ))}
          <ListItem bottomDivider containerStyle={styles.listBackground}>
            <ListItem.Content>
              <ListItem.Title>
                <TouchableOpacity
                  disabled={!netInfo.isConnected}
                  onPress={() => navigation.navigate(ROUTES.CONFIRM_PIN)}>
                  <Text style={[styles.listStyle, styles.textPrimary]}>
                    {translate('pin.change')}
                  </Text>
                </TouchableOpacity>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <Button
            type="clear"
            title={translate('user.download_my_data')}
            containerStyle={styles.marginTopMd}
            onPress={handleExport}
            disabled={!netInfo.isConnected}
          />
          <Button
            title={translate('user.delete')}
            buttonStyle={styles.bgGrey}
            onPress={handleDelete}
            disabled={!netInfo.isConnected}
          />
        </View>
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
