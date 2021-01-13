/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {Header, ListItem, Text, Button} from 'react-native-elements';
import {ScrollView, View} from 'react-native';
import styles from '../../assets/styles';
import moment from 'moment';
import {useSelector} from 'react-redux';
import settings from '../../../config/settings';

const UserProfile = () => {
  const profile = useSelector((state) => state.user.profile);

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

  return (
    <>
      <Header
        leftComponent={{text: 'Back'}}
        centerComponent={{text: 'Preferences'}}
        rightComponent={{text: 'Logout'}}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View>
          {userInfo.map((user, i) => (
            <>
              <ListItem
                key={`label-${i}`}
                bottomDivider
                containerStyle={styles.userProfileListBackground}>
                <ListItem.Content>
                  <ListItem.Title>{user.label}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem bottomDivider key={`value-${i}`}>
                <ListItem.Content>
                  <ListItem.Title>{user.value}</ListItem.Title>
                </ListItem.Content>
                <Text style={styles.userProfileTextFontSize}>
                  {user.rightContentValue}
                </Text>
              </ListItem>
            </>
          ))}

          <ListItem
            bottomDivider
            containerStyle={styles.userProfileListBackground}>
            <ListItem.Content>
              <ListItem.Title style={styles.textPrimary}>
                Change PIN
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
