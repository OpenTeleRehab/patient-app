/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Button, Divider, Input, Text} from 'react-native-elements';
import {Alert, ScrollView, View, Platform} from 'react-native';
import styles from '../../assets/styles';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {ROUTES} from '../../variables/constants';
import {updateProfileRequest} from '../../store/user/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import {getTranslate} from 'react-localize-redux';
import {formatDate, isValidDateFormat} from '../../utils/helper';
import DatePicker from '../../components/Common/DatePicker';
import settings from '../../../config/settings';

const UserProfileEdit = ({navigation}) => {
  const profile = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contractDate, setContractDate] = useState(null);
  const [userInfo, setUserInfo] = useState({
    id: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    language_id: 1,
  });

  useEffect(() => {
    if (profile) {
      setUserInfo({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        gender: profile.gender,
        date_of_birth: isValidDateFormat(profile.date_of_birth)
          ? profile.date_of_birth
          : moment(profile.date_of_birth).format(settings.format.date),
        language_id: profile.language_id,
      });
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
      dispatch(updateProfileRequest(profile.id, userInfo, profile.phone)).then(
        (result) => {
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
        },
      );
    }
  };

  const onSucceed = () => {
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

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('edit.profile.title')}
        rightContent={{
          label: translate('common.cancel'),
          onPress: () => navigation.goBack(),
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.formGroup}>
          <Input
            label={translate('first.name')}
            labelStyle={[styles.formLabel, styles.textSmall, styles.marginTop]}
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
          <Divider style={styles.marginTop} />
          <Input
            label={translate('last.name')}
            labelStyle={[styles.formLabel, styles.textSmall, styles.marginTop]}
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
          <Divider style={styles.marginTop} />
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.formLabel, styles.textSmall]}>
            {translate('common.gender')}
          </Text>
          <Picker
            prompt={translate('common.gender')}
            selectedValue={userInfo.gender}
            onValueChange={(itemValue, itemIndex) =>
              setUserInfo({...userInfo, ['gender']: itemValue})
            }>
            <Picker.Item label={translate('gender.male')} value="male" />
            <Picker.Item label={translate('gender.female')} value="female" />
          </Picker>
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
          <Picker
            prompt={translate('common.language')}
            style={styles.formControl}
            selectedValue={userInfo.language_id}
            onValueChange={(itemValue, itemIndex) =>
              setUserInfo({...userInfo, ['language_id']: itemValue})
            }>
            <Picker.Item label={translate('common.language.en')} value={1} />
            <Picker.Item label={translate('common.language.vn')} value={2} />
          </Picker>
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
        />
      </ScrollView>
    </>
  );
};
export default UserProfileEdit;
