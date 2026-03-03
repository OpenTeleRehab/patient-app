/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../variables/constants';
import {auths} from '../variables/routes';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  const initialRouteName = useSelector((state) => state.user.initialRouteName);

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName || ROUTES.REGISTER}
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
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

export default AuthStackNavigator;
