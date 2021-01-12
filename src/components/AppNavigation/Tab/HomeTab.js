/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {useDispatch} from 'react-redux';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {Button, withTheme} from 'react-native-elements';
import {View} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import {homes} from '../../../variables/routes';
import styles from '../../../assets/styles';
import {logoutRequest} from '../../../store/user/actions';

const Drawer = createDrawerNavigator();

const HomeTab = (props) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  const renderDrawerContent = (navProps) => {
    const {state, navigation} = navProps;
    return (
      <View style={styles.navDrawerContainer}>
        <DrawerContentScrollView {...navProps}>
          {homes.map((route, index) => {
            if (route.label) {
              return (
                <DrawerItem
                  key={index}
                  focused={state.routeNames[state.index] === route.name}
                  label={route.label}
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
          <Button title="Logout" onPress={() => handleLogout()} />
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
