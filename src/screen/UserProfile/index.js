/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect} from 'react';
import {ListItem, Text} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import styles from '../../assets/styles';
import moment from 'moment';
import settings from '../../../config/settings';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import HeaderBar from '../../components/Common/HeaderBar';
import {formatDate, isValidDateFormat} from '../../utils/helper';
import {getLanguageName} from '../../utils/language';
import {getLanguageRequest} from '../../store/language/actions';

const UserProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {languages} = useSelector((state) => state.language);

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
    },
    {
      label: 'date.of.birth',
      value: isValidDateFormat(profile.date_of_birth)
        ? profile.date_of_birth
        : formatDate(profile.date_of_birth),
      rightContentValue:
        'Age: ' +
        (profile.date_of_birth ? calculateAge(profile.date_of_birth) : 0),
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
          onPress: () => navigation.navigate(ROUTES.USER_PROFILE_EDIT),
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
