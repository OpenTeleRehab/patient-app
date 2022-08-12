/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';
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
      RNCallKeep.displayIncomingCall(
        callUUID,
        remoteMessage.data.body,
        remoteMessage.data.title,
        'generic',
        remoteMessage.data.body.includes('video'),
      );

      const callInfo = {
        callUUID,
        rid: remoteMessage.data.rid,
        _id: remoteMessage.data._id,
        body: remoteMessage.data.body,
      };

      await storeLocalData(STORAGE_KEY.CALL_INFO, callInfo, true);
    }

    console.log(
      '++++ Message with data handled in the background! ++++',
      remoteMessage,
    );
  } else {
    PushNotificationIOS.getApplicationIconBadgeNumber((badgeNumber) => {
      let newBadgeNumber = badgeNumber || 0;
      newBadgeNumber++;
      PushNotificationIOS.setApplicationIconBadgeNumber(newBadgeNumber);
    });

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
