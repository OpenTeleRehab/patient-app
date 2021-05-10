/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Button, Divider, Input, Text} from 'react-native-elements';
import {Alert, ScrollView, View, Platform} from 'react-native';
import styles from '../../assets/styles';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES, STORAGE_KEY} from '../../variables/constants';
import {updateProfileRequest} from '../../store/user/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import {getTranslate} from 'react-localize-redux';
import {formatDate, isValidDateFormat} from '../../utils/helper';
import DatePicker from '../../components/Common/DatePicker';
import settings from '../../../config/settings';
import {getTranslations} from '../../store/translation/actions';
import {storeLocalData} from '../../utils/local_storage';
import SelectPicker from '../../components/Common/SelectPicker';
import _ from 'lodash';
import {useNetInfo} from '@react-native-community/netinfo';

const UserProfileEdit = ({navigation}) => {
  const profile = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {languages} = useSelector((state) => state.language);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contractDate, setContractDate] = useState(null);
  const [userInfo, setUserInfo] = useState({
    id: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    language_id: '',
  });
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [originUserInfo, setOrginUserInfo] = useState(null);
  const netInfo = useNetInfo();

  useEffect(() => {
    if (profile) {
      const profileInfo = {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth
          ? isValidDateFormat(profile.date_of_birth)
            ? profile.date_of_birth
            : moment(profile.date_of_birth).format(settings.format.date)
          : null,
        language_id: profile.language_id,
      };
      setUserInfo(profileInfo);
      setOrginUserInfo(profileInfo);
      if (profile.date_of_birth) {
        if (isValidDateFormat(profile.date_of_birth)) {
          moment(profile.date_of_birth, settings.format.date).toDate();
        } else {
          setContractDate(moment(profile.date_of_birth).toDate());
        }
      }
    }
  }, [profile, setUserInfo, setContractDate]);

  const handleSave = () => {
    setFirstNameError(userInfo.first_name === '');
    setLastNameError(userInfo.last_name === '');
    if (userInfo.first_name === '' || userInfo.last_name === '') {
      Alert.alert(
        translate('edit.profile.title').toString(),
        userInfo.last_name === ''
          ? translate('error.message.last.name').toString()
          : translate('error.message.first.name').toString(),
        [
          {
            text: translate('common.ok').toString(),
            onPress: () => navigation.navigate(ROUTES.USER_PROFILE_EDIT),
          },
        ],
        {cancelable: false},
      );
    } else {
      dispatch(
        updateProfileRequest(
          profile.id,
          userInfo,
          profile.phone,
          profile.therapist_id,
        ),
      ).then((result) => {
        if (result) {
          Alert.alert(
            translate('edit.profile.title').toString(),
            translate('success.message.edit.profile').toString(),
            [
              {
                text: translate('common.ok').toString(),
                onPress: () => onSucceed(),
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            translate('edit.profile.title').toString(),
            translate('error.message.edit.profile').toString(),
            [
              {
                text: translate('common.ok').toString(),
                onPress: () => navigation.navigate(ROUTES.USER_PROFILE_EDIT),
              },
            ],
            {cancelable: false},
          );
        }
      });
    }
  };

  const onSucceed = () => {
    dispatch(getTranslations(userInfo.language_id));
    storeLocalData(STORAGE_KEY.LANGUAGE, userInfo.language_id);
    navigation.navigate(ROUTES.USER_PROFILE);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onSetDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setContractDate(selectedDate);
      setUserInfo({
        ...userInfo,
        ['date_of_birth']: formatDate(selectedDate),
      });
    }
  };

  const resetData = () => {
    setUserInfo(originUserInfo);
    if (originUserInfo.date_of_birth) {
      if (isValidDateFormat(originUserInfo.date_of_birth)) {
        setContractDate(
          moment(originUserInfo.date_of_birth, settings.format.date).toDate(),
        );
      } else {
        setContractDate(moment(originUserInfo.date_of_birth).toDate());
      }
    } else {
      setContractDate(null);
    }
  };

  const handleGoBack = () => {
    if (_.isEqual(userInfo, originUserInfo)) {
      navigation.navigate(ROUTES.USER_PROFILE);
    } else {
      Alert.alert(
        translate('edit.profile.title').toString(),
        translate('edit.profile.discard.message').toString(),
        [
          {
            text: translate('common.cancel').toString(),
            onPress: () => navigation.navigate(ROUTES.USER_PROFILE_EDIT),
            style: 'cancel',
          },
          {
            text: translate('common.ok').toString(),
            onPress: () => {
              resetData();
              navigation.navigate(ROUTES.USER_PROFILE);
            },
          },
        ],
      );
    }
  };

  return (
    <>
      <HeaderBar
        onGoBack={() => handleGoBack()}
        title={translate('edit.profile.title')}
      />
      <ScrollView>
        <View style={styles.mainContainerLight}>
          <View style={styles.formGroup}>
            <Input
              label={translate('first.name')}
              labelStyle={[
                styles.formLabel,
                styles.textSmall,
                styles.marginTop,
              ]}
              inputContainerStyle={styles.noneBorderBottom}
              containerStyle={styles.inputContainer}
              value={userInfo.first_name}
              onChangeText={(value) =>
                setUserInfo({
                  ...userInfo,
                  ['first_name']: value,
                })
              }
            />
            <Divider
              style={[
                styles.marginTop,
                firstNameError ? styles.bgDanger : null,
              ]}
            />
            <Input
              label={translate('last.name')}
              labelStyle={[
                styles.formLabel,
                styles.textSmall,
                styles.marginTop,
              ]}
              inputContainerStyle={styles.noneBorderBottom}
              containerStyle={styles.inputContainer}
              value={userInfo.last_name}
              onChangeText={(value) =>
                setUserInfo({
                  ...userInfo,
                  ['last_name']: value,
                })
              }
            />
            <Divider
              style={[styles.marginTop, lastNameError ? styles.bgDanger : null]}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, styles.textSmall]}>
              {translate('common.gender')}
            </Text>
            <SelectPicker
              placeholder={{}}
              value={userInfo.language_id}
              onValueChange={(value) =>
                setUserInfo({...userInfo, ['gender']: value})
              }
              items={[
                {label: translate('gender.male'), value: 'male'},
                {label: translate('gender.female'), value: 'female'},
                {label: translate('gender.other'), value: 'other'},
              ]}
            />
            <Divider />
          </View>
          <DatePicker
            label={translate('date.of.birth')}
            value={contractDate}
            mode="date"
            onSetDate={onSetDate}
            show={showDatePicker}
            onClickIcon={showDatepicker}
          />
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, styles.textSmall]}>
              {translate('common.language')}
            </Text>
            <SelectPicker
              placeholder={{}}
              value={userInfo.language_id}
              onValueChange={(value) =>
                setUserInfo({...userInfo, ['language_id']: value})
              }
              items={languages.map((lang) => ({
                label: lang.name,
                value: lang.id,
              }))}
            />
            <Divider />
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, styles.textSmall]}>
              {translate('phone.number')}
            </Text>
            <Text style={styles.textFormDisabled}>{profile.phone}</Text>
            <Divider style={styles.marginTop} />
          </View>
          <Button
            title={translate('common.save')}
            onPress={handleSave}
            containerStyle={styles.marginTopMd}
            disabled={
              !netInfo.isConnected || _.isEqual(userInfo, originUserInfo)
            }
          />
        </View>
      </ScrollView>
    </>
  );
};
export default UserProfileEdit;
