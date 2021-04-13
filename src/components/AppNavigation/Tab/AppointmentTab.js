/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {appointments} from '../../../variables/routes';
import {ROUTES} from '../../../variables/constants';

const Stack = createStackNavigator();

const AppointmentTab = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ROUTES.APPOINTMENT}
      screenOptions={{gestureEnabled: false}}>
      {appointments.map((route, index) => {
        return (
          <Stack.Screen
            key={index}
            name={route.name}
            component={route.screen}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default AppointmentTab;
