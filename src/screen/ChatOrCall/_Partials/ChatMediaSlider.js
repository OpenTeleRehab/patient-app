/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  const {isOnlineMode} = useSelector((state) => state.indicator);
  const translate = getTranslate(localize);
  const [sliderWidth] = useState(SCREEN_WIDTH);
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.max(
      0,
      isVideoAttachment
        ? items.findIndex((item) => item.video === currentAttachment)
        : items.findIndex((item) => item.image === currentAttachment),
    ),
  );

  const insets = useSafeAreaInsets();

  const changeIndex = (index) => {
    setCurrentIndex(index);
  };

  const notify = (message) => {
    if (Platform.OS === 'ios') {
      Alert.alert(translate('common.download'), message);
    } else {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const handleDownloadMedia = async () => {
    const item = items[currentIndex];
    const attachment_url = item?.video || item?.image;
    if (!attachment_url) {
      return;
    }

    // A queued (not yet uploaded) attachment still points at the local file picked by the user;
    // anything else lives on the chat server and needs the network.
    const isLocalFile = !/^https?:\/\//i.test(attachment_url);
    if (!isLocalFile && !isOnlineMode) {
      notify(translate('error.message.network.error'));
      return;
    }

    try {
      const location = await getDownloadDirectoryPath();
      const toFile = `${location}/${getRocketChatAttachmentFilename(attachment_url)}`;

      if (isLocalFile) {
        // copyFile fails on iOS when the target exists, unlike downloadFile which overwrites it.
        if (await RNFS.exists(toFile)) {
          await RNFS.unlink(toFile);
        }
        await RNFS.copyFile(attachment_url.replace('file://', ''), toFile);
      } else {
        const {statusCode} = await RNFS.downloadFile({
          fromUrl: attachment_url,
          toFile,
        }).promise;

        // downloadFile resolves on HTTP errors too, leaving the error body saved as the file.
        if (statusCode < 200 || statusCode >= 300) {
          await RNFS.unlink(toFile).catch(() => {});
          throw new Error(`Download failed with status ${statusCode}`);
        }
      }

      notify(translate('activity.file_has_been_downloaded_successfully'));
    } catch (error) {
      console.log('Download media failed', error);
      notify(translate('error.message.network.error'));
    }
  };

  return (
    <Modal animationType="fade" statusBarTranslucent visible>
      <View
        style={[
          styles.modalHeaderAction,
          styles.flexRow,
          styles.justifyContentSpaceBetween,
          styles.flexCenter,
          {
            top: insets.top,
          },
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
            inactiveSlideScale={1}
            firstItem={currentIndex}
            initialScrollIndex={currentIndex}
            getItemLayout={(_, index) => ({
              length: sliderWidth,
              offset: sliderWidth * index,
              index,
            })}
            onSnapToItem={changeIndex}
          />
        ) : (
          <Gallery
            data={items?.map((item) => item?.image) ?? []}
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
