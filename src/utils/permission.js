import {PermissionsAndroid, Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNCallKeep from 'react-native-callkeep';
import messaging from '@react-native-firebase/messaging';

export const requestCallPermission = () => {
  const options = {
    ios: {
      appName: 'PatientApp',
      imageName: 'sim_icon',
      supportsVideo: true,
      maximumCallGroups: '1',
      maximumCallsPerCallGroup: '1',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'ok',
      additionalPermissions: [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ],
    },
  };

  RNCallKeep.setup(options);
};

export const requestNotificationPermission = () => {
  // iOS - Requesting permissions
  messaging().requestPermission();

  // Android - Requesting permissions
  if (Platform.OS === 'android') {
    PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS').then();
  }
};

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    return result === RESULTS.GRANTED;
  }
};

export const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    const permission = Platform.Version >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return result === RESULTS.GRANTED;
  }
};
