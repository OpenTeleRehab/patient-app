/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {Button, withTheme} from 'react-native-elements';
import {View, Switch, Text} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import {homes} from '../../../variables/routes';
import styles from '../../../assets/styles';
import {enableKidTheme, logoutRequest} from '../../../store/user/actions';
import {getTranslate} from 'react-localize-redux';

const Drawer = createDrawerNavigator();

const HomeTab = (props) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {accessToken, profile} = useSelector((state) => state.user);
  const [isKidTheme, setIsKidTheme] = useState(profile.kid_theme !== 0);

  const handleKidThemeChange = (value) => {
    setIsKidTheme(value);
    dispatch(enableKidTheme(accessToken, value));
  };

  const handleLogout = () => {
    dispatch(logoutRequest(accessToken));
  };

  const renderDrawerContent = (navProps) => {
    const {state, navigation} = navProps;
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
                  onPress={() => navigation.navigate(route.name)}
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
            title={translate('common.logout')}
            titleStyle={styles.textUpperCase}
            onPress={() => handleLogout()}
          />
        </View>
      </View>
    );
  };

  return (
    <Drawer.Navigator
      drawerPosition="right"
      edgeWidth={window.innerWidth}
      drawerContent={(navProps) => renderDrawerContent(navProps)}
      drawerContentOptions={{
        inactiveTintColor: props.theme.colors.grey,
        activeTintColor: props.theme.colors.primary,
      }}
      screenOptions={{swipeEnabled: false}}>
      {homes.map((route, index) => {
        return (
          <Drawer.Screen
            key={index}
            name={route.name}
            component={route.screen}
          />
        );
      })}
    </Drawer.Navigator>
  );
};

export default withTheme(HomeTab);
