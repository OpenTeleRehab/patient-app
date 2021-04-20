/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import styles from '../../../assets/styles';
import VideoPlayer from 'react-native-video-player';
import {View} from 'react-native';

const ChatTypeVideo = ({chatData}) => {
  return (
    <View style={styles.chatAttachmentContainer}>
      <VideoPlayer
        video={{uri: chatData.currentMessage.video}}
        thumbnail={{uri: chatData.currentMessage.video}}
        endThumbnail={{uri: chatData.currentMessage.video}}
        style={styles.chatMessageVideo}
      />
    </View>
  );
};

export default ChatTypeVideo;
