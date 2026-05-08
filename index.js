/**
 * @format
 */

import React from 'react';
import {AppRegistry, Platform, PermissionsAndroid, TextInput, Text as ReactNativeText} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';
import {getLocalData, storeLocalData} from './src/utils/local_storage';
import {STORAGE_KEY} from './src/variables/constants';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import BackgroundTimer from 'react-native-background-timer';
import _ from 'lodash';
import {Text} from 'react-native-elements';
import notifee from '@notifee/react-native';
import moment from 'moment';
import settings from './config/settings';

ReactNativeText.defaultProps = {
  ...ReactNativeText.defaultProps,
  maxFontSizeMultiplier: 1.4,
};

Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.4,
};

TextInput.defaultProps = {
  ...TextInput.defaultProps,
  maxFontSizeMultiplier: 1.4,
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (!_.isEmpty(remoteMessage.data)) {
    if (remoteMessage.data.event_type === 'appointment') {
      await displayAppointmentNotification(
        remoteMessage.data?.title,
        remoteMessage.data?.start_date,
        remoteMessage.data?.end_date,
      );
    } else if (
      remoteMessage.data.body.endsWith('_missed') ||
      remoteMessage.data.body.endsWith('_accepted')
    ) {
      const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);

      if (callInfo?.callUUID) {
        RNCallKeep.reportEndCallWithUUID(callInfo.callUUID, 2);
      }

      await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);
    } else {
      const callUUID = uuid.v4();

      const callInfo = {
        callUUID,
        rid: remoteMessage.data.rid,
        _id: remoteMessage.data._id,
        body: remoteMessage.data.body,
      };

      await storeLocalData(STORAGE_KEY.CALL_INFO, callInfo, true);
      await storeLocalData(STORAGE_KEY.ACCEPTED_CALL, 'false');
      await storeLocalData(STORAGE_KEY.REJECTED_CALL, 'false');

      if (Platform.OS === 'ios') {
        displayIncomingCall(callUUID, remoteMessage);
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
              PermissionsAndroid.PERMISSIONS.CAMERA,
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
            RNCallKeep.registerPhoneAccount(options);
            RNCallKeep.registerAndroidEvents();
            RNCallKeep.setAvailable(true);

            displayIncomingCall(callUUID, remoteMessage);

            const timeoutId = BackgroundTimer.setTimeout(() => {
              getLocalData(STORAGE_KEY.CALL_INFO, true).then(async (item) => {
                if (item?.callUUID === callUUID) {
                  await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);

                  RNCallKeep.reportEndCallWithUUID(callUUID, 2);
                }
              });
            }, 60000);

            RNCallKeep.addEventListener('answerCall', async () => {
              BackgroundTimer.clearTimeout(timeoutId);

              await storeLocalData(STORAGE_KEY.ACCEPTED_CALL, 'true');

              RNCallKeep.reportEndCallWithUUID(callUUID, 2);
              RNCallKeep.backToForeground();
            });

            RNCallKeep.addEventListener('endCall', async () => {
              BackgroundTimer.clearTimeout(timeoutId);

              await storeLocalData(STORAGE_KEY.REJECTED_CALL, 'true');

              RNCallKeep.backToForeground();
            });
          })
          .catch((e) => {
            console.log('Error while initializing call keep: ', e);
          });
      }
    }
  } else {
    // Message without data handled in the background
    if (Platform.OS === 'ios') {
      PushNotificationIOS.getApplicationIconBadgeNumber((badgeNumber) => {
        let newBadgeNumber = badgeNumber || 0;
        newBadgeNumber++;
        PushNotificationIOS.setApplicationIconBadgeNumber(newBadgeNumber);
      });
    }
  }
});

const displayAppointmentNotification = async (title, startDate, endDate) => {
  const startDateFormatted = moment
    .utc(startDate)
    .local()
    .format(settings.format.date + ' ' + settings.format.time);

  const endDateFormatted = moment
    .utc(endDate)
    .local()
    .format(settings.format.date + ' ' + settings.format.time);

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title: title,
    body: startDateFormatted + ' - ' + endDateFormatted,
    android: {
      channelId,
      localOnly: true,
      pressAction: {
        id: 'default',
      },
      smallIcon: 'ic_notification',
    },
  });
}

const displayIncomingCall = (callUUID, remoteMessage) => {
  const handle = remoteMessage.data.title;
  const localizedCallerName = remoteMessage.data.title;
  const hasVideo = remoteMessage.data.body.includes('video');

  RNCallKeep.displayIncomingCall(callUUID, handle, localizedCallerName, 'generic', hasVideo);
};

const HeadlessCheck = ({isHeadless}) => {
  if (isHeadless) {
    // App has been launched in the background (killed state)
    // Return null or a dummy component to prevent rendering the UI
    return null;
  }

  // App launched normally by the user
  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
