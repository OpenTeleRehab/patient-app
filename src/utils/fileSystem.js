/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {PermissionsAndroid, Platform} from 'react-native';
import RNFS from 'react-native-fs';

export const getDownloadDirectoryPath = async () => {
  let location = '';
  if (Platform.OS === 'ios') {
    location = RNFS.DocumentDirectoryPath + '/Downloads';
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (!granted) {
      return false;
    }
    location = RNFS.ExternalStorageDirectoryPath + '/Download';
  }
  return location;
};

export const getRocketChatAttachmentFilename = (attachment_url) => {
  return attachment_url.split('/').pop().split('?')[0];
};
