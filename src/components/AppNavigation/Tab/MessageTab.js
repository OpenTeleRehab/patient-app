/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {messages} from '../../../variables/routes';
import {ROUTES} from '../../../variables/constants';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();

const MessageTab = () => {
  const {chatRooms} = useSelector((state) => state.rocketchat);

  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={
        chatRooms.length > 1 ? ROUTES.CHAT_ROOM_LIST : ROUTES.CHAT_PANEL
      }
      screenOptions={{gestureEnabled: false, headerShown: false}}>
      {messages.map((route, index) => {
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

export default MessageTab;
