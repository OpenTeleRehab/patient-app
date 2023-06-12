import {PermissionsAndroid, Platform} from 'react-native';
import RNCallKeep from '@webessentials/react-native-callkeep';
import messaging from '@react-native-firebase/messaging';

export const callPermission = () => {
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
      additionalPermissions: [],
    },
  };

  RNCallKeep.setup(options);
};

export const notificationPermission = () => {
  // iOS - Requesting permissions
  messaging().requestPermission();

  // Android - Requesting permissions
  if (Platform.OS === 'android') {
    PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS').then();
  }
};

export const cameraRollPermission = () => {
  const permission =
    Platform.Version >= 33
      ? 'android.permission.READ_MEDIA_IMAGES'
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  PermissionsAndroid.request(permission);
};
