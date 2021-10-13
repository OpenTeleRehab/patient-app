/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Switch, Text, View} from 'react-native';
import styles from '../../assets/styles';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {homes} from '../../variables/routes';
import FIcon from 'react-native-vector-icons/Feather';
import {Button} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {enableKidTheme, logoutRequest} from '../../store/user/actions';

const DrawerNavigator = ({navProps}) => {
  const dispatch = useDispatch();
  const {state, navigation} = navProps;
  // eslint-disable-next-line no-shadow
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  // eslint-disable-next-line no-shadow
  const {accessToken, profile} = useSelector((state) => state.user);
  const [isKidTheme, setIsKidTheme] = useState(profile.kid_theme !== 0);

  const handleKidThemeChange = (value) => {
    setIsKidTheme(value);
    dispatch(enableKidTheme(accessToken, value));
  };

  const handleNavigate = (route) => {
    navigation.closeDrawer();
    navigation.navigate(route.name);
  };

  const handleLogout = () => {
    dispatch(logoutRequest(accessToken));
  };

  return (
    <View style={styles.navDrawerContainer}>
      <DrawerContentScrollView {...navProps}>
        <View
          style={[
            styles.navKidThemeWrapper,
            styles.flexRow,
            styles.flexCenter,
            styles.justifyContentSpaceAround,
          ]}>
          <Text style={styles.navKidThemeLabel}>
            {translate('common.theme.kid')}
          </Text>
          <Switch
            trackColor={{false: '#767577', true: '#0077C8'}}
            thumbColor={'#ffffff'}
            ios_backgroundColor="#767577"
            onValueChange={(value) => handleKidThemeChange(value)}
            value={isKidTheme}
          />
        </View>
        {homes.map((route, index) => {
          if (route.label) {
            return (
              <DrawerItem
                key={index}
                focused={state.routeNames[state.index] === route.name}
                label={translate(route.label)}
                onPress={() => handleNavigate(route)}
                icon={({focused, size, color}) => (
                  <FIcon name={route.icon} color={color} size={size} />
                )}
              />
            );
          }
          return null;
        })}
      </DrawerContentScrollView>
      <View style={styles.navDrawerBottom}>
        <Button
          raised={false}
          title={translate('common.logout')}
          buttonStyle={styles.btnStandard}
          onPress={() => handleLogout()}
        />
      </View>
    </View>
  );
};

export default DrawerNavigator;
