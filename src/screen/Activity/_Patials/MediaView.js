/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {ActivityIndicator, Dimensions, Modal, View} from 'react-native';
import {Button, Image, withTheme} from 'react-native-elements';
import Orientation from 'react-native-orientation-locker';
import {
  PORTRAIT,
  LANDSCAPE,
} from 'react-native-orientation-locker/ScreenOrientation';

import styles from '../../../assets/styles';
import Carousel from 'react-native-snap-carousel';
import settings from '../../../../config/settings';

const styleToggleScreenBtn = {
  position: 'absolute',
  zIndex: 99,
};
const styleCloseBtn = {
  position: 'absolute',
  zIndex: 99,
  right: 0,
};

const SLIDER_WIDTH = Dimensions.get('window').width;
const styleImage = {width: '100%', height: 200};

const RenderMediaItem = ({item, index}) => {
  return (
    <Image
      source={{uri: settings.adminApiBaseURL + '/file/' + item.id}}
      style={styleImage}
      PlaceholderContent={<ActivityIndicator size={50} />}
    />
  );
};

const MediaView = ({theme, activity, showMedia, onClose}) => {
  const [screenOrientation, setScreenOrientation] = useState(PORTRAIT);

  const toggleScreenOrientation = () => {
    if (screenOrientation === PORTRAIT) {
      setScreenOrientation(LANDSCAPE);
      Orientation.lockToLandscape();
    } else {
      setScreenOrientation(PORTRAIT);
      Orientation.lockToPortrait();
    }
  };

  const handleClose = () => {
    Orientation.lockToPortrait();
    onClose();
  };

  return (
    <Modal statusBarTranslucent>
      <Button
        type="clear"
        icon={{
          name: `${screenOrientation === PORTRAIT ? 'expand' : 'compress'}`,
          type: 'font-awesome-5',
          size: 32,
        }}
        onPress={toggleScreenOrientation}
        containerStyle={styleToggleScreenBtn}
      />
      <Button
        type="clear"
        icon={{
          name: 'times-circle',
          type: 'font-awesome-5',
          size: 32,
        }}
        onPress={handleClose}
        containerStyle={styleCloseBtn}
      />

      <View
        style={[
          styles.flexRow,
          styles.flexCenter,
          styles.justifyContentCenter,
        ]}>
        <Carousel
          data={activity.files}
          renderItem={RenderMediaItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={SLIDER_WIDTH}
          inactiveSlideScale={1}
          firstItem={showMedia}
        />
      </View>
    </Modal>
  );
};

export default withTheme(MediaView);
