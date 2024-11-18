/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {homes} from '../../../variables/routes';
import {withTheme} from 'react-native-elements';
import DrawerNavigator from '../DrawerNavigator';

const Drawer = createDrawerNavigator();

const HomeTab = (props) => {
  const renderDrawerContent = (navProps) => {
    return <DrawerNavigator navProps={navProps} />;
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
      screenOptions={{swipeEnabled: false, headerShown: false, drawerPosition: 'right'}}>
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
