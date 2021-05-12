/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import styles from '../../../assets/styles';
import VideoPlayer from 'react-native-video-player';
import {View, TouchableOpacity} from 'react-native';

const ChatTypeVideo = ({
  chatData,
  onShowMediaSlider,
  onCurrentAttachment,
  isVideoAttachment,
}) => {
  const handleMediaClick = (currentMedia) => {
    onShowMediaSlider(true);
    isVideoAttachment(true);
    onCurrentAttachment(currentMedia);
  };

  return (
    <View style={styles.chatAttachmentContainer}>
      <TouchableOpacity
        onPress={() => handleMediaClick(chatData.currentMessage.video)}>
        <VideoPlayer
          video={{uri: chatData.currentMessage.video}}
          thumbnail={{uri: chatData.currentMessage.video}}
          endThumbnail={{uri: chatData.currentMessage.video}}
          style={styles.chatMessageVideo}
          onStart={() => handleMediaClick(chatData.currentMessage.video)}
          onPlayPress={() => handleMediaClick(chatData.currentMessage.video)}
          disableControlsAutoHide={true}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatTypeVideo;
