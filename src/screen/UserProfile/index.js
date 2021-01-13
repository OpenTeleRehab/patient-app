/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ListItem, Text, Button} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import styles from '../../assets/styles';
import moment from 'moment';
import settings from '../../../config/settings';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import HeaderBar from '../../components/Common/HeaderBar';
import {logoutRequest} from '../../store/user/actions';

const UserProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const calculateAge = (dob) => {
    const currentDate = moment();
    return currentDate.diff(moment(dob, 'DD-MM-YYYY'), 'year');
  };

  const userInfo = [
    {
      label: 'NAME',
      value: profile.last_name + ' ' + profile.first_name,
    },
    {
      label: 'GENDER',
      value: profile.gender ? profile.gender : '',
    },
    {
      label: 'DATE OF BIRTH',
      value: profile.date_of_birth
        ? moment(profile.date_of_birth).format(settings.format.date)
        : '',
      rightContentValue:
        'Age: ' +
        (profile.date_of_birth ? calculateAge(profile.date_of_birth) : 0),
    },
    {
      label: 'MOBILE NUMBER',
      value: profile.phone,
    },
    {
      label: 'LANGUAGE',
      value: profile.language ? profile.language : 'English',
    },
  ];

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
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
                  <ListItem.Title>{user.label}</ListItem.Title>
                </ListItem.Content>
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
          <Button title="Edit" containerStyle={styles.marginTopMd} />
        </View>
      </ScrollView>
    </>
  );
};

export default UserProfile;
