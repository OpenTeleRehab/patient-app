/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  ToastAndroid,
  View,
  StyleSheet,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

import styles from '../../../assets/styles';
import {
  getDownloadDirectoryPath,
  getRocketChatAttachmentFilename,
} from '../../../utils/fileSystem';
import Gallery from 'react-native-awesome-gallery';
import variables from '../../../assets/styles/variables';

const SCREEN_WIDTH = Dimensions.get('window').width;
const mediaSize = {width: '100%', height: '100%'};

const renderItem = ({item, index}, currentIndex) => {
  if (index !== currentIndex) {
    return null;
  }

  return (
    <Video
      source={{uri: item.video}}
      resizeMode="contain"
      controls
      style={mediaSize}
    />
  );
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
            accessibilityLabel={translate('common.download')}
            name="save-alt"
            size={28}
            color={theme.colors.white}
            onPress={handleDownloadMedia}
          />
          <Icon
            accessibilityLabel={translate('common.close')}
            name="close"
            size={28}
            color={theme.colors.white}
            onPress={() => onShowMediaSlider(false)}
          />
        </View>
      </View>
      <View style={componentStyles.wrapper}>
        {isVideoAttachment ? (
          <Carousel
            data={items}
            renderItem={(props) => renderItem(props, currentIndex)}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
            firstItem={currentIndex}
            inactiveSlideScale={1}
            onSnapToItem={changeIndex}
          />
        ) : (
          <Gallery
            data={items?.map((item) => item.image) ?? []}
            initialIndex={currentIndex}
            disableVerticalSwipe
            onIndexChange={changeIndex}
          />
        )}
      </View>
    </Modal>
  );
};

const componentStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    backgroundColor: variables.dark,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ChatMediaSlider;
