/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Icon} from 'react-native-elements';
import Video from 'react-native-video';
import variables from '../../../assets/styles/variables';

const ChatTypeVideo = ({
  chatData,
  onShowMediaSlider,
  onCurrentAttachment,
  isVideoAttachment,
}) => {
  const handleMediaClick = () => {
    onShowMediaSlider(true);
    isVideoAttachment(true);
    onCurrentAttachment(chatData.currentMessage.video);
  };

  return (
    <View style={componentStyles.videoContainer}>
      <Video
        source={{uri: chatData.currentMessage.video}}
        resizeMode="cover"
        controls={false}
        style={componentStyles.video}
      />
      <Pressable style={componentStyles.playBackdrop} onPress={handleMediaClick}>
        <Icon
          raised name="play-arrow"
          size={18}
          onPress={handleMediaClick}
        />
      </Pressable>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  videoContainer: {
    backgroundColor: variables.primary,
    borderRadius: 12,
    position: 'relative',
    margin: 4,
    overflow: 'hidden',
    width: 142,
  },
  video: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  playBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
});

export default ChatTypeVideo;
