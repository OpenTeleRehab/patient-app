/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

// No storage permission is needed: from Android 11 apps may write their own files to the shared
// Download folder, and WRITE_EXTERNAL_STORAGE is no longer granted to apps targeting it.
export const getDownloadDirectoryPath = async () => {
  const location =
    Platform.OS === 'ios'
      ? RNFS.DocumentDirectoryPath + '/Downloads'
      : RNFS.ExternalStorageDirectoryPath + '/Download';

  if (!(await RNFS.exists(location))) {
    await RNFS.mkdir(location);
  }

  return location;
};

export const getRocketChatAttachmentFilename = (attachment_url) => {
  return attachment_url.split('/').pop().split('?')[0];
};
