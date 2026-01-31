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
    // Message with data handled in the background
    const callUUID = uuid.v4();

    if (remoteMessage.data.isLocal) {
      const splitedDates = remoteMessage.data.body.split('|');

      await displayAppointmentNotification(
        remoteMessage.data.title,
        splitedDates[0],
        splitedDates[1],
      );
    } else if (remoteMessage.data.event_type === 'appointment') {
      await displayAppointmentNotification(
        remoteMessage.data.title,
        remoteMessage.data.start_date,
        remoteMessage.data.end_date,
      );
    } else if (remoteMessage.data.body.includes('missed')) {
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
          true,
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

            BackgroundTimer.setTimeout(() => {
              isOnCall = true;
              RNCallKeep.endCall(callUUID);
            }, 60000);
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
    },
  });
}

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
