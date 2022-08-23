/**
 * @format
 */

import React from 'react';
import {AppRegistry, Platform, PermissionsAndroid} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from '@webessentials/react-native-callkeep';
import uuid from 'react-native-uuid';
import {getLocalData, storeLocalData} from './src/utils/local_storage';
import {STORAGE_KEY} from './src/variables/constants';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import _ from 'lodash';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (!_.isEmpty(remoteMessage.data)) {
    const callUUID = uuid.v4();

    if (remoteMessage.data.body.includes('missed')) {
      const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);
      RNCallKeep.endCall(callInfo.callUUID);
      await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);
    } else {
      const callInfo = {
        callUUID,
        rid: remoteMessage.data.rid,
        _id: remoteMessage.data._id,
        body: remoteMessage.data.body,
      };

      await storeLocalData(STORAGE_KEY.CALL_INFO, callInfo, true);

      if (Platform.OS === 'ios') {
        RNCallKeep.displayIncomingCall(
          callUUID,
          remoteMessage.data.body,
          remoteMessage.data.title,
          'generic',
          remoteMessage.data.body.includes('video'),
        );
      } else {
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
            alertDescription:
              'This application needs to access your phone accounts',
            cancelButton: 'Cancel',
            okButton: 'ok',
            additionalPermissions: [
              PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
              PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
            ],
            foregroundService: {
              channelId: 'org.hi.patient',
              channelName: 'Foreground service for my app',
              notificationTitle: 'My app is running on background',
              notificationIcon: 'Path to the resource icon of the notification',
            },
          },
        };

        RNCallKeep.checkPhoneAccountEnabled()
          .then(() => {
            let isOnCall = false;
            RNCallKeep.registerPhoneAccount(options);
            RNCallKeep.registerAndroidEvents();
            RNCallKeep.setAvailable(true);
            RNCallKeep.displayIncomingCall(
              callUUID,
              remoteMessage.data.title,
              remoteMessage.data.title,
              'generic',
              remoteMessage.data.body.includes('video'),
            );
            RNCallKeep.addEventListener('answerCall', async () => {
              isOnCall = true;
              await storeLocalData(STORAGE_KEY.REJECTED_CALL, 'false', false);
              RNCallKeep.backToForeground();
              RNCallKeep.endCall(callUUID);
            });

            RNCallKeep.addEventListener('endCall', async () => {
              if (isOnCall !== true) {
                await storeLocalData(STORAGE_KEY.REJECTED_CALL, 'true', false);
                RNCallKeep.backToForeground();
              }
            });
          })
          .catch((e) => {
            console.log('Error while initializing call keep: ', e);
          });
      }
    }

    console.log(
      '++++ Message with data handled in the background! ++++',
      remoteMessage,
    );
  } else {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.getApplicationIconBadgeNumber((badgeNumber) => {
        let newBadgeNumber = badgeNumber || 0;
        newBadgeNumber++;
        PushNotificationIOS.setApplicationIconBadgeNumber(newBadgeNumber);
      });
    }

    console.log(
      '==== Message without data handled in the background! ====',
      remoteMessage,
    );
  }
});

const AppFake = () => {
  return null;
};

const HeadlessCheck = ({isHeadless}) => {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return <AppFake />;
  }

  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
