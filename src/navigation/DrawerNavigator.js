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
import {ROUTES} from '../variables/constants';
import BottomTabNavigator from './BottomTabNavigator';
import DrawerContent from './DrawerContent';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// TabNavigation plus every other screen, in a real stack: back returns to the screen you came from (not always to
// the tabs, as when these were drawer screens), and screens unmount when you leave them.
const MainStackNavigator = () => {
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
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TabNavigation" component={BottomTabNavigator} />
      {stacks.map(({name, screen}) => (
        <Stack.Screen key={name} name={name} component={screen} />
      ))}
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={DrawerContent}
    screenOptions={{
      drawerPosition: 'right',
      headerShown: false,
      swipeEnabled: false,
    }}>
    <Drawer.Screen name={ROUTES.MAIN_STACK} component={MainStackNavigator} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
