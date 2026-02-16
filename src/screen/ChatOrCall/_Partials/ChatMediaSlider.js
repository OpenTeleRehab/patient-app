/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {
  Image,
  Alert,
  Dimensions,
  Modal,
  Platform,
  ToastAndroid,
  View,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import VideoPlayer from 'react-native-video-player';
import RNFS from 'react-native-fs';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';

import styles from '../../../assets/styles';
import {
  getDownloadDirectoryPath,
  getRocketChatAttachmentFilename,
} from '../../../utils/fileSystem';

const styleCarouselContainer = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
};
const SCREEN_WIDTH = Dimensions.get('window').width;
const mediaSize = {width: '100%', height: '100%'};
const mediaResizeMode = {resizeMode: 'contain'};

const RenderMediaItem = ({item, index}, currentIndex) => {
  if (item.image !== '') {
    return (
      <View style={mediaSize}>
        <ReactNativeZoomableView
          maxZoom={2}
          minZoom={1}
          movementSensibility={0.5}>
          <Image
            style={[mediaSize, mediaResizeMode]}
            source={{uri: item.image}}
          />
        </ReactNativeZoomableView>
      </View>
    );
  }

  if (item.video !== '') {
    return (
      <VideoPlayer
        autoplay
        source={{uri: item.video}}
        resizeMode="contain"
        paused={index !== currentIndex}
        audioOnly={true}
        disableFullscreen={true}
        style={mediaSize}
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
        ]}>
        <Text style={[styles.textLight, styles.fontSizeMd]}>
          {currentIndex + 1}/{items.length}
        </Text>
        <View
          style={[
            styles.flexDirectionRow,
            styles.alignItemsCenter,
            styles.columnGap16,
          ]}>
          <Icon
            name="save-alt"
            size={26}
            color={theme.colors.white}
            onPress={handleDownloadMedia}
          />
          <Icon
            name="close"
            size={26}
            color={theme.colors.white}
            onPress={() => onShowMediaSlider(false)}
          />
        </View>
      </View>

      <View style={styleCarouselContainer}>
        <Carousel
          data={items}
          renderItem={(props) => RenderMediaItem(props, currentIndex)}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
          firstItem={currentIndex}
          inactiveSlideScale={1}
          onSnapToItem={changeIndex}
        />
      </View>
    </Modal>
  );
};

export default ChatMediaSlider;
