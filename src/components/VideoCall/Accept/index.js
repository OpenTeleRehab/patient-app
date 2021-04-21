/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import JitsiMeet, {JitsiMeetView} from '@webessentials/react-native-jitsi-meet';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../assets/styles';
import settings from '../../../../config/settings';

const AcceptCall = ({
  theme,
  roomId,
  subject,
  displayName,
  loadingText,
  onEndCall,
  onVideoOn,
  onSpeakerOn,
  onMute,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const options = {
        audioOnly: !onVideoOn,
        audioMuted: onMute,
        videoMuted: onMute,
        subject,
      };
      const meetFeatureFlags = {
        'chat.enabled': false,
        'ios.recording.enabled': false,
        'live-streaming.enabled': false,
        'meeting-name.enabled': false,
        'meeting-password.enabled': true,
        'pip.enabled': false,
        'raise-hand.enabled': false,
        'recording.enabled': false,
        'welcomepage.enabled': false,
      };
      const roomURL = `${settings.jitsiBaseUrl}/${roomId}`;
      const userInfo = {displayName, email: '', avatar: ''};
      JitsiMeet.call(roomURL, userInfo, options, meetFeatureFlags);
    }, 1000);
  }, [onVideoOn, onMute, subject, roomId, displayName]);

  const onConferenceTerminated = (event) => {
    JitsiMeet.endCall();
    onEndCall();
  };

  const onConferenceJoined = (event) => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const onConferenceWillJoin = (event) => {};

  return (
    <>
      <Spinner
        visible={isLoading}
        textContent={loadingText}
        textStyle={styles.textLight}
        overlayColor={theme.colors.platform.android.primary}
      />
      <JitsiMeetView
        onConferenceTerminated={(e) => onConferenceTerminated(e)}
        onConferenceJoined={(e) => onConferenceJoined(e)}
        onConferenceWillJoin={(e) => onConferenceWillJoin(e)}
        style={styles.videoMeetingWrapper}
      />
    </>
  );
};

export default AcceptCall;
