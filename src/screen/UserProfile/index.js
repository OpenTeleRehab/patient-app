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
      value: profile.gender ? translate(`gender.${profile.gender}`) : '',
      hasEdit: true,
    },
    {
      label: 'date.of.birth',
      value: isValidDateFormat(profile.date_of_birth)
        ? profile.date_of_birth
        : formatDate(profile.date_of_birth),
      rightContentValue:
        'Age: ' +
        (profile.date_of_birth ? calculateAge(profile.date_of_birth) : 0),
      hasEdit: true,
    },
    {
      label: 'phone.number',
      value: `+${profile.phone}`,
    },
    {
      label: 'common.language',
      value: profile.language_id
        ? profile.language_id === 1
          ? translate('common.language.en')
          : translate('common.language.vn')
        : translate('common.language.en'),
      hasEdit: true,
    },
  ];

  const handleLogout = () => {
    dispatch(logoutRequest(accessToken));
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
          <Text
            style={styles.textPrimary}
            onPress={() => navigation.navigate(ROUTES.USER_PROFILE_EDIT)}>
            {user.hasEdit ? translate('common.edit') : ''}
          </Text>
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
          label: translate('common.logout'),
          onPress: () => handleLogout(),
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View>
          {userInfo.map((user, index) => (
            <RenderListItem {...user} key={index} />
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
