/**
 * @format
 */

import React from 'react';
import {AppRegistry, Platform, TextInput, Text as ReactNativeText} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';
import {getLocalData, storeLocalData} from './src/utils/local_storage';
import {STORAGE_KEY} from './src/variables/constants';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import BackgroundTimer from 'react-native-background-timer';
import {Text} from 'react-native-elements';
import notifee from '@notifee/react-native';
import moment from 'moment';
import settings from './config/settings';
import store from './src/store';

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

const activeCalls = new Set();

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (remoteMessage && Object.keys(remoteMessage.data).length > 0) {
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

      if (callInfo._id === remoteMessage.data._id) {
        removeCall(callInfo?.callUUID);
        await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);
      }
    } else {
      const callInfo = await getLocalData(STORAGE_KEY.CALL_INFO, true);
      const videoCall = store.getState().rocketchat?.videoCall;
      const showIncomingCall = store.getState().rocketchat?.showIncomingCall;
      const showAcceptedCall = store.getState().rocketchat?.showAcceptedCall;

      if (activeCalls.has(callInfo?.callUUID)) {
        return;
      }

      if (videoCall && (showIncomingCall || showAcceptedCall)) {
        return;
      }

      await didReceiveStartCallAction(remoteMessage.data);
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

const didReceiveStartCallAction = async (data) => {
  const {rid, _id, body} = data;

  const callUUID = uuid.v4();
  const callInfo = {callUUID, rid, _id, body};

  activeCalls.add(callUUID);

  await storeLocalData(STORAGE_KEY.CALL_INFO, callInfo, true);
  await storeLocalData(STORAGE_KEY.ACCEPTED_CALL, 'false');
  await storeLocalData(STORAGE_KEY.REJECTED_CALL, 'false');

  if (Platform.OS === 'ios') {
    displayIncomingCall(callUUID, data);
  } else {
    // Registers android ui events
    RNCallKeep.registerAndroidEvents();

    // Display incoming calls system ui
    displayIncomingCall(callUUID, data);

    // Tell ConnectionService that the device is ready to make outgoing calls
    RNCallKeep.setAvailable(true);

    // Answer call listener
    RNCallKeep.addEventListener('answerCall', async () => {
      BackgroundTimer.clearTimeout(timeoutId);

      await storeLocalData(STORAGE_KEY.ACCEPTED_CALL, 'true');

      RNCallKeep.backToForeground();

      removeCall(callUUID);
    });

    // End call listener
    RNCallKeep.addEventListener('endCall', async () => {
      BackgroundTimer.clearTimeout(timeoutId);

      await storeLocalData(STORAGE_KEY.REJECTED_CALL, 'true');

      RNCallKeep.backToForeground();

      activeCalls.delete(callUUID);
    });

    const timeoutId = BackgroundTimer.setTimeout(() => {
      getLocalData(STORAGE_KEY.CALL_INFO, true).then(async (item) => {
        if (item?.callUUID === callUUID) {
          await storeLocalData(STORAGE_KEY.CALL_INFO, {}, true);

          removeCall(callUUID);
        }
      });
    }, 60000);
  }
};

const displayIncomingCall = (callUUID, data) => {
  try {
    const handle = data.title;
    const localizedCallerName = data.title;
    const hasVideo = data.body.includes('video');

    activeCalls.add(callUUID);

    RNCallKeep.displayIncomingCall(
      callUUID,
      handle,
      localizedCallerName,
      'generic',
      hasVideo,
    );
  } catch (error) {
    console.error('displayIncomingCall failed:', error.message);
  }
};

const removeCall = (callUUID) => {
  activeCalls.delete(callUUID);

  RNCallKeep.reportEndCallWithUUID(callUUID, 2);
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
