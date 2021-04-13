/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {goals} from '../../../variables/routes';
import {ROUTES} from '../../../variables/constants';

const Stack = createStackNavigator();

const GoalTab = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ROUTES.GOAL}
      screenOptions={{gestureEnabled: false}}>
      {goals.map((route, index) => {
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

export default GoalTab;
