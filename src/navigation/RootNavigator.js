/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import AuthNavigator from './AuthNavigator';

const RootStack = createStackNavigator();

const RootNavigator = () => {
  const {accessToken} = useSelector((state) => state.user);

  return (
    <RootStack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      {accessToken ? (
        <RootStack.Screen name="App" component={DrawerNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
