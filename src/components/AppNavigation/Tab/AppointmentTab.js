/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {appointments} from '../../../variables/routes';
import {withTheme} from 'react-native-elements';
import DrawerNavigator from '../DrawerNavigator';

const Drawer = createDrawerNavigator();

const AppointmentTab = (props) => {
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
      screenOptions={{swipeEnabled: false}}>
      {appointments.map((route, index) => {
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

export default withTheme(AppointmentTab);
