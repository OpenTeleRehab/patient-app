/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useRef, useState} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  View,
  useWindowDimensions,
} from 'react-native';
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
const styleMedia = {width: '100%', height: '100%'};

const RenderMediaItem = ({item, index}, activeIndex, onZoomChange) => {
  const uri = store.getState().phone.adminApiBaseURL + '/file/' + item.id;
  const type = item.fileType;
  const isActive = index === activeIndex;
  const isPlayable = type === 'video/mp4' || type === 'audio/mpeg';

  // Only mount players for the visible slide so media stops once swiped away
  if (isPlayable && !isActive) {
    return <View style={styleMedia} />;
  }

  if (type === 'video/mp4') {
    return (
      <VideoPlayer
        autoplay
        source={{uri}}
        style={styleMedia}
        resizeMode="contain"
        disableFullscreen={true}
        onError={e => console.log('VIDEO ERROR', e)}
      />
    );
  }

  if (type === 'audio/mpeg') {
    return (
      <VideoPlayer
        autoplay
        source={{uri}}
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
      initialZoom={1}
      disablePanOnInitialZoom
      onShouldBlockNativeResponder={(e, g, {zoomLevel}) => zoomLevel > 1}
      onPanResponderTerminationRequest={(e, g, {zoomLevel}) => zoomLevel <= 1}
      onTransform={({zoomLevel}) => isActive && onZoomChange(zoomLevel > 1)}>
      <Image
        source={{uri}}
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
  const [activeIndex, setActiveIndex] = useState(showMedia);
  const [isZoomed, setIsZoomed] = useState(false);
  const {width: sliderWidth} = useWindowDimensions();
  const carouselRef = useRef(null);

  const toggleScreenOrientation = () => {
    if (screenOrientation === PORTRAIT) {
      setScreenOrientation(LANDSCAPE);
      Orientation.lockToLandscape();
    } else {
      setScreenOrientation(PORTRAIT);
      Orientation.lockToPortrait();
    }
  };

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
    setIsZoomed(false);
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
                ref={carouselRef}
                data={activity.files}
                extraData={activeIndex}
                renderItem={(props) =>
                  RenderMediaItem(props, activeIndex, setIsZoomed)
                }
                sliderWidth={sliderWidth}
                itemWidth={sliderWidth}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                firstItem={showMedia}
                initialScrollIndex={showMedia}
                getItemLayout={(_, index) => ({
                  length: sliderWidth,
                  offset: sliderWidth * index,
                  index,
                })}
                scrollEnabled={!isZoomed}
                onSnapToItem={handleSnapToItem}
              />
              {screenOrientation === PORTRAIT && (
                <Pagination
                  carouselRef={carouselRef.current}
                  tappableDots={!!carouselRef.current}
                  dotsLength={activity.files.length}
                  activeDotIndex={activeIndex}
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
