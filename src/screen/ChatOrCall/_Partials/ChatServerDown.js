/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Icon, Text} from 'react-native-elements';
import variables from '../../../assets/styles/variables';

const ChatServerDown = ({translate, onRetry}) => (
  <View style={componentStyles.container}>
    <Icon name="cloud-off" size={40} color={variables.danger} />
    <Text style={componentStyles.text}>
      {translate('chat_message.server_down')}
    </Text>
    <Button
      title={translate('common.retry')}
      icon={<Icon name="refresh" size={20} color={variables.white} style={componentStyles.retryIcon} />}
      onPress={onRetry}
      containerStyle={componentStyles.retryButtonContainer}
    />
  </View>
);

const componentStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: variables.spacingLg,
  },
  text: {
    color: variables.danger,
    fontSize: 16,
    fontWeight: variables.fontWeightMedium,
    textAlign: 'center',
  },
  retryButtonContainer: {
    marginTop: variables.spacingMd,
  },
  retryIcon: {
    marginRight: 6,
  },
});

export default ChatServerDown;
