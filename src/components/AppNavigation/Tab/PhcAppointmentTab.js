/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {drawerItems, phcAppointments} from '../../../variables/routes';
import {withTheme} from 'react-native-elements';
import DrawerNavigator from '../DrawerNavigator';

const Drawer = createDrawerNavigator();

const PhcAppointmentTab = (props) => {
  const renderDrawerContent = (navProps) => {
    return (
      <DrawerNavigator
        navProps={navProps}
        drawerItems={drawerItems.slice(0, -1)}
        allowSwitchTheme={false}
      />
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
      screenOptions={{
        swipeEnabled: false,
        headerShown: false,
        drawerPosition: 'right',
      }}
    >
      {phcAppointments.map((route, index) => {
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

export default withTheme(PhcAppointmentTab);
