/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {
  activities,
  appointments,
  drawerItems,
  interviews,
  messages,
  miscellaneous,
  patients,
} from '../variables/routes';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerContent from './DrawerContent';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = () => {
  const {profile} = useSelector((state) => state.user);

  let stacks = [
    ...activities,
    ...appointments,
    ...messages,
    ...drawerItems,
    ...miscellaneous,
  ];

  if (profile.type === 'phc_worker') {
    stacks = [
      ...patients,
      ...interviews,
      ...messages,
      ...drawerItems,
      ...miscellaneous,
    ];
  }

  return (
    <Drawer.Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        swipeEnabled: false,
      }}>
      <Stack.Screen name="TabNavigation" component={BottomTabNavigator} />
      {stacks.map(({name, screen}) => (
        <Stack.Screen key={name} name={name} component={screen} />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
