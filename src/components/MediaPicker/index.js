/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useRef} from 'react';
import {Alert, Keyboard} from 'react-native';
import {Icon, ListItem, withTheme} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  requestCameraPermission,
  requestGalleryPermission,
} from '../../utils/permission';
import {isValidFileSize, toMB} from '../../utils/helper';
import settings from '../../../config/settings';
import styles from '../../assets/styles';

const MediaPicker = ({theme, visible, onSend, onClose}) => {
  const bottomSheetModalRef = useRef(null);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const renderBackdrop = useCallback(
    (backdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleSheetChanges = useCallback(
    (index) => {
      if (index === -1) {
        onClose(false);
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (visible) {
      // Dismiss keyboard
      Keyboard.dismiss();

      // Open bottom sheet
      bottomSheetModalRef.current?.present();
    } else {
      // Close bottom sheet
      bottomSheetModalRef.current?.close();
    }
  }, [visible]);

  const handleLaunchCamera = async (mediaType) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    // Close bottom sheet
    onClose(false);

    // Launch camera to take photo or video
    const options = {
      mediaType: mediaType,
      saveToPhotos: false,
      includeBase64: false,
      includeExtra: true,
    };

    await launchCamera(options, handleMediaPickerResponse);
  };

  const handleLaunchImageLibrary = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    // Close bottom sheet
    onClose(false);

    // Launch gallery to pick image or video
    const options = {
      mediaType: 'mixed',
      saveToPhotos: false,
      selectionLimit: 10,
      includeBase64: false,
      includeExtra: true,
    };

    await launchImageLibrary(options, handleMediaPickerResponse);
  };

  const handleMediaPickerResponse = (response) => {
    if (response.assets && response.assets.length > 0) {
      const totalFileSize = response.assets.reduce(
        (accumulator, currentObject) => {
          return accumulator + currentObject.fileSize;
        },
        0, // The '0' is the initial value of the accumulator
      );

      // Check valid file size
      const validSize = isValidFileSize(toMB(totalFileSize));

      if (validSize) {
        response?.assets?.forEach((asset) => {
          // Send attachment message
          onSend('', asset, asset.type);
        });
      } else {
        // Alert invalid file size
        Alert.alert(
          translate('common.error_title_invalid_file_size'),
          translate('common.error_message_invalid_file_size', {
            size: settings.fileMaxUploadSize,
          }),
          [
            {
              text: translate('common.ok'),
              onPress: () => null,
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}>
      <BottomSheetView style={styles.bottomSheetView}>
        <ListItem
          containerStyle={styles.bottomSheetListItemContainer}
          onPress={() => handleLaunchCamera('photo')}>
          <Icon
            reverse
            reverseColor={theme.colors.black}
            color={theme.colors.grey9}
            name="camera"
            type="entypo"
            size={20}
          />
          <ListItem.Content>
            <ListItem.Title>{translate('common.take_photo')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem
          containerStyle={styles.bottomSheetListItemContainer}
          onPress={() => handleLaunchCamera('video')}>
          <Icon
            reverse
            reverseColor={theme.colors.black}
            color={theme.colors.grey9}
            name="video-camera"
            type="entypo"
            size={20}
          />
          <ListItem.Content>
            <ListItem.Title>{translate('common.record_video')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem
          containerStyle={styles.bottomSheetListItemContainer}
          onPress={handleLaunchImageLibrary}>
          <Icon
            reverse
            reverseColor={theme.colors.black}
            color={theme.colors.grey9}
            name="image-inverted"
            type="entypo"
            size={20}
          />
          <ListItem.Content>
            <ListItem.Title>
              {translate('common.choose_from_library')}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default withTheme(MediaPicker);
