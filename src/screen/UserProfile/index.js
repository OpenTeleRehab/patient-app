/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ListItem, Text} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import styles from '../../assets/styles';
import moment from 'moment';
import settings from '../../../config/settings';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import HeaderBar from '../../components/Common/HeaderBar';
import {logoutRequest} from '../../store/user/actions';
import {formatDate, isValidDateFormat} from '../../utils/helper';

const UserProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const accessToken = useSelector((state) => state.user.accessToken);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const calculateAge = (dob) => {
    const currentDate = moment();
    const dateOfBirth = isValidDateFormat(dob)
      ? moment(dob, settings.format.date).toDate()
      : moment(dob);
    return currentDate.diff(dateOfBirth, 'year');
  };

  const userInfo = [
    {
      label: 'common.name',
      value: profile.last_name + ' ' + profile.first_name,
    },
    {
      label: 'common.gender',
      value: profile.gender ? profile.gender : '',
      rightLabel: 'common.edit',
    },
    {
      label: 'date.of.birth',
      value: isValidDateFormat(profile.date_of_birth)
        ? profile.date_of_birth
        : formatDate(profile.date_of_birth),
      rightContentValue:
        'Age: ' +
        (profile.date_of_birth ? calculateAge(profile.date_of_birth) : 0),
      rightLabel: 'common.edit',
    },
    {
      label: 'phone.number',
      value: profile.phone,
    },
    {
      label: 'common.language',
      value: profile.language
        ? profile.language
        : translate('common.language.en'),
      rightLabel: 'common.edit',
    },
  ];

  const handleLogout = () => {
    dispatch(logoutRequest(accessToken));
  };

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.navigate(ROUTES.HOME)}
        title={translate('preferences')}
        rightContent={{
          label: translate('common.logout'),
          onPress: () => handleLogout(),
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View>
          {userInfo.map((user, i) => (
            <>
              <ListItem
                key={`label-${i}`}
                bottomDivider
                containerStyle={styles.listBackground}>
                <ListItem.Content>
                  <ListItem.Title>
                    {translate(user.label).toLocaleUpperCase()}
                  </ListItem.Title>
                </ListItem.Content>
                <Text
                  style={styles.textPrimary}
                  onPress={() => navigation.navigate(ROUTES.USER_PROFILE_EDIT)}>
                  {user.rightLabel ? translate(user.rightLabel) : ''}
                </Text>
              </ListItem>
              <ListItem bottomDivider key={`value-${i}`}>
                <ListItem.Content>
                  <ListItem.Title>{user.value}</ListItem.Title>
                </ListItem.Content>
                <Text style={styles.listStyle}>{user.rightContentValue}</Text>
              </ListItem>
            </>
          ))}
          <ListItem bottomDivider containerStyle={styles.listBackground}>
            <ListItem.Content>
              <ListItem.Title>
                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.CONFIRM_PIN)}>
                  <Text style={[styles.listStyle, styles.textPrimary]}>
                    {translate('pin.change')}
                  </Text>
                </TouchableOpacity>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </ScrollView>
    </>
  );
};

export default UserProfile;
