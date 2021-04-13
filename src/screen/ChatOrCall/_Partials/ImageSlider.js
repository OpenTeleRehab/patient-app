/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, Modal, View} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';

import Carousel from 'react-native-snap-carousel';
import styles from '../../../assets/styles';

const styleCarouselContainer = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
};
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const styleMedia = {width: '100%', height: '100%'};

const RenderMediaItem = ({item, index}) => {
  return (
    <Image
      source={{uri: item}}
      style={styleMedia}
      resizeMode="contain"
      PlaceholderContent={<ActivityIndicator color="#fff" size="large" />}
    />
  );
};

const ImageSlider = ({theme, items, currentIndex, onClose}) => {
  const [sliderWidth, setSliderWidth] = useState(SCREEN_WIDTH);

  return (
    <Modal visible onRequestClose={() => onClose(false)}>
      <View
        style={[
          styles.modalHeaderAction,
          styles.flexRow,
          styles.justifyContentSpaceBetween,
          styles.flexCenter,
          styles.paddingMd,
        ]}>
        <View>
          <Text style={[styles.textLight, styles.fontSizeMd]}>1/2</Text>
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
              onPress={() => onClose(false)}
            />
            <Button
              type="clear"
              icon={{
                name: 'closecircleo',
                type: 'antdesign',
                size: 24,
                color: theme.colors.white,
              }}
              onPress={() => onClose(false)}
            />
          </View>
        </View>
      </View>

      <View style={styleCarouselContainer}>
        <Carousel
          data={items}
          renderItem={RenderMediaItem}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
          // inactiveSlideScale={1}
          // firstItem={1}
        />
      </View>
    </Modal>
  );
};

export default ImageSlider;
