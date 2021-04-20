/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import styles from '../../../assets/styles';
import {View, ActivityIndicator} from 'react-native';
import {Image} from 'react-native-elements';

const ChatTypeImage = ({chatData, theme}) => {
  return (
    <View style={styles.chatAttachmentContainer}>
      <Image
        source={{uri: chatData.currentMessage.image}}
        style={styles.chatMessageImage}
        PlaceholderContent={<ActivityIndicator color={theme.colors.primary} />}
      />
    </View>
  );
};

export default ChatTypeImage;
