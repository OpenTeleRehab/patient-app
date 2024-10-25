/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Dimensions, Image, Modal, SafeAreaView, View} from 'react-native';
import {Button, withTheme} from 'react-native-elements';
import Orientation from 'react-native-orientation-locker';
import {PORTRAIT, LANDSCAPE} from 'react-native-orientation-locker';
import VideoPlayer from 'react-native-video-player';
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import music from '../../../assets/images/music.png';
import styles from '../../../assets/styles';
import store from '../../../store';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';

const styleToggleScreenBtn = {
  position: 'absolute',
  zIndex: 99,
};
const styleCloseBtn = {
  position: 'absolute',
  zIndex: 99,
  right: 0,
};
const styleCarouselContainer = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
};
const stylePaginationDot = {
  width: 10,
  height: 10,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#fff',
};
const musicUri = Image.resolveAssetSource(music).uri;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const styleMedia = {width: '100%', height: '100%'};

const RenderMediaItem = ({item, index}, activeItem) => {
  const uri = store.getState().phone.adminApiBaseURL + '/file/' + item.id;
  const type = item.fileType;
  const autoplay = index === activeItem;

  if (type === 'video/mp4') {
    return (
      <VideoPlayer
        autoplay={autoplay}
        video={{uri}}
        style={styleMedia}
        resizeMode="contain"
        disableFullscreen={true}
      />
    );
  }

  if (type === 'audio/mpeg') {
    return (
      <VideoPlayer
        autoplay={autoplay}
        video={{uri}}
        resizeMode="contain"
        style={styleMedia}
        poster={musicUri}
        audioOnly={true}
        disableFullscreen={true}
      />
    );
  }
  return (
    <ReactNativeZoomableView
      maxZoom={3}
      minZoom={1}
      zoomStep={0.5}
      initialZoom={1}>
      <Image
        source={{
          uri: store.getState().phone.adminApiBaseURL + '/file/' + item.id,
        }}
        style={styleMedia}
        resizeMode="contain"
      />
    </ReactNativeZoomableView>
  );
};

const MediaView = ({theme, activity, showMedia, onClose}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [screenOrientation, setScreenOrientation] = useState(PORTRAIT);
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(SCREEN_WIDTH);

  const toggleScreenOrientation = () => {
    if (screenOrientation === PORTRAIT) {
      setScreenOrientation(LANDSCAPE);
      setSliderWidth(SCREEN_HEIGHT);
      Orientation.lockToLandscape();
    } else {
      setScreenOrientation(PORTRAIT);
      setSliderWidth(SCREEN_WIDTH);
      Orientation.lockToPortrait();
    }
  };

  const handleClose = () => {
    Orientation.lockToPortrait();
    onClose();
  };

  return (
    <Modal>
      <SafeAreaView style={[styles.flexCenter, styles.bgPrimary]}>
        <View style={styles.flexRow}>
          <Button
            accessibilityLabel={translate('common.zoom.in.out')}
            type="clear"
            icon={{
              name: `${screenOrientation === PORTRAIT ? 'expand' : 'compress'}`,
              type: 'font-awesome-5',
              size: 32,
              color: theme.colors.white,
            }}
            onPress={toggleScreenOrientation}
            containerStyle={styleToggleScreenBtn}
          />
          <Button
            accessibilityLabel={translate('common.close')}
            type="clear"
            icon={{
              name: 'times-circle',
              type: 'font-awesome-5',
              size: 32,
              color: theme.colors.white,
            }}
            onPress={handleClose}
            containerStyle={styleCloseBtn}
          />
          <View style={styleCarouselContainer}>
            <View>
              <Carousel
                data={activity.files}
                renderItem={(props) => RenderMediaItem(props, showMedia)}
                sliderWidth={sliderWidth}
                itemWidth={sliderWidth}
                inactiveSlideScale={1}
                firstItem={showMedia}
                onSnapToItem={(index) => setActivePaginationIndex(index)}
              />
              {screenOrientation === PORTRAIT && (
                <Pagination
                  dotsLength={activity.files.length}
                  activeDotIndex={activePaginationIndex}
                  dotStyle={stylePaginationDot}
                  dotColor={theme.colors.white}
                  inactiveDotColor="transparent"
                  inactiveDotScale={1}
                />
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default withTheme(MediaView);
