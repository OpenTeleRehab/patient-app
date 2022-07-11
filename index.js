/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (remoteMessage.data) {
    const callUUID = uuid.v4();

    RNCallKeep.displayIncomingCall(
      callUUID,
      remoteMessage.data.body,
      remoteMessage.data.title,
    );

    console.log('++++ Message handled in the background! ++++', remoteMessage);
  }
});

AppRegistry.registerComponent(appName, () => App);
