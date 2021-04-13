/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import styles from '../../../assets/styles';
import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';

const ChatTypeImage = ({
  chatData,
  onShowMediaSlider,
  onCurrentAttachment,
  isVideoAttachment,
  theme,
}) => {
  const handleMediaClick = (currentMedia) => {
    onShowMediaSlider(true);
    isVideoAttachment(false);
    onCurrentAttachment(currentMedia);
  };

  return (
    <View style={styles.chatAttachmentContainer}>
      <TouchableOpacity
        onPress={() => handleMediaClick(chatData.currentMessage.image)}>
        <Image
          source={{uri: chatData.currentMessage.image}}
          style={styles.chatMessageImage}
          PlaceholderContent={
            <ActivityIndicator color={theme.colors.primary} />
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatTypeImage;
