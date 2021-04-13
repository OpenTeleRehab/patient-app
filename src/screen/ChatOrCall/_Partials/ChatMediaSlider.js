/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  ToastAndroid,
  View,
} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';

import Carousel from 'react-native-snap-carousel';
import styles from '../../../assets/styles';
import VideoPlayer from 'react-native-video-player';
import RNFS from 'react-native-fs';
import {
  getDownloadDirectoryPath,
  getRocketChatAttachmentFilename,
} from '../../../utils/fileSystem';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

const styleCarouselContainer = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
};
const SCREEN_WIDTH = Dimensions.get('window').width;
const styleMedia = {width: '100%', height: '100%'};

const RenderMediaItem = ({item, index}, currentIndex) => {
  if (item.image !== '') {
    return (
      <Image
        source={{uri: item.image}}
        style={styleMedia}
        resizeMode="contain"
        PlaceholderContent={<ActivityIndicator color="#ffffff" size="large" />}
      />
    );
  }

  if (item.video !== '') {
    return (
      <VideoPlayer
        autoplay={index === currentIndex}
        video={{uri: item.video}}
        resizeMode="contain"
        style={styleMedia}
        audioOnly={true}
        disableFullscreen={true}
      />
    );
  }
};

const ChatMediaSlider = ({
  theme,
  items = [],
  currentAttachment,
  onShowMediaSlider,
  isVideoAttachment,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [sliderWidth] = useState(SCREEN_WIDTH);
  const [currentIndex, setCurrentIndex] = useState(
    isVideoAttachment
      ? items.findIndex((item) => item.video === currentAttachment)
      : items.findIndex((item) => item.image === currentAttachment),
  );

  const changeIndex = (index) => {
    setCurrentIndex(index);
  };

  const handleDownloadMedia = async () => {
    const location = await getDownloadDirectoryPath();
    if (location === false) {
      return;
    }

    const attachment_url =
      items[currentIndex].video !== ''
        ? items[currentIndex].video
        : items[currentIndex].image;

    RNFS.downloadFile({
      fromUrl: attachment_url,
      toFile: `${location}/${getRocketChatAttachmentFilename(attachment_url)}`,
    }).promise.then(() => {
      if (Platform.OS === 'ios') {
        Alert.alert(
          translate('common.download'),
          translate('activity.file_has_been_downloaded_successfully'),
        );
      } else {
        ToastAndroid.show(
          translate('activity.file_has_been_downloaded_successfully'),
          ToastAndroid.SHORT,
        );
      }
    });
  };

  return (
    <Modal animationType="fade" visible>
      <View
        style={[
          styles.modalHeaderAction,
          styles.flexRow,
          styles.justifyContentSpaceBetween,
          styles.flexCenter,
          styles.paddingMd,
        ]}>
        <View>
          <Text style={[styles.textLight, styles.fontSizeMd]}>
            {currentIndex + 1}/{items.length}
          </Text>
        </View>
        <View>
          <View style={styles.flexRow}>
            <Button
              type="clear"
              icon={{
                name: 'download',
                type: 'antdesign',
                size: 24,
                color: theme.colors.white,
              }}
              onPress={() => handleDownloadMedia()}
            />
            <Button
              type="clear"
              icon={{
                name: 'closecircleo',
                type: 'antdesign',
                size: 24,
                color: theme.colors.white,
              }}
              onPress={() => onShowMediaSlider(false)}
            />
          </View>
        </View>
      </View>

      <View style={styleCarouselContainer}>
        <Carousel
          data={items}
          renderItem={(props) => RenderMediaItem(props, currentIndex)}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
          firstItem={currentIndex}
          onSnapToItem={changeIndex}
        />
      </View>
    </Modal>
  );
};

export default ChatMediaSlider;
