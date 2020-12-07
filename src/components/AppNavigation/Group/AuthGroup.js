/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {auths} from '../../../variables/routes';

const Stack = createStackNavigator();

const AuthGroup = () => {
  return (
    <Stack.Navigator headerMode="none">
      {auths.map((route, index) => {
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

export default AuthGroup;
