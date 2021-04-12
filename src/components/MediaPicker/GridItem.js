/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Image, Dimensions, TouchableOpacity, View} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import styles from '../../assets/styles';
import {Icon} from 'react-native-elements';

const EDGE_MARGIN = 5;
const GridItem = (props) => {
  const {item, itemsPerRow, selected, onSelected} = props;
  const {width} = Dimensions.get('window');
  const itemSize = (width - (itemsPerRow + 1) * EDGE_MARGIN) / itemsPerRow - 1;
  const {type, image} = item;
  const selectedItem = selected !== null ? selected.image : {};
  const isSelected = image.uri === selectedItem.uri;

  return (
    <TouchableOpacity
      onPress={() => onSelected(item)}
      style={styles.mpMediaContainer}>
      <View style={styles.mpMediaSelection}>
        <Icon
          name={isSelected ? 'check-circle' : 'radio-button-off'}
          type="material"
          color="#ffffff"
        />
      </View>
      {type.includes('video/') ? (
        <VideoPlayer
          muted
          video={{uri: image.uri}}
          thumbnail={{uri: image.uri}}
          endThumbnail={{uri: image.uri}}
          style={styles.mpMediaItem(itemSize, isSelected)}
        />
      ) : (
        <Image
          source={{uri: image.uri}}
          style={styles.mpMediaItem(itemSize, isSelected)}
        />
      )}
    </TouchableOpacity>
  );
};

export default GridItem;
