/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {activities} from '../../../variables/routes';
import {ROUTES} from '../../../variables/constants';

const Stack = createStackNavigator();

const ActivityTab = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ROUTES.ACTIVITY}
      screenOptions={{gestureEnabled: false, headerShown: false}}>
      {activities.map((route, index) => {
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

export default ActivityTab;
