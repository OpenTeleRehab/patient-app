/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import JitsiMeet, {JitsiMeetView} from '@webessentials/react-native-jitsi-meet';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../assets/styles';
import settings from '../../../../config/settings';
import {Platform} from 'react-native';

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
  const platform = Platform.OS;
  const [isLoading, setIsLoading] = useState(true);
  const [jitsiVisible, setJitsiVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const options = {
        audioOnly: !onVideoOn,
        audioMuted: onMute,
        videoMuted: onMute,
        subject,
      };
      const meetFeatureFlags = {
        'meeting-name.enabled': true,
        'chat.enabled': false,
        'ios.recording.enabled': false,
        'live-streaming.enabled': false,
        'meeting-password.enabled': false,
        'pip.enabled': false,
        'raise-hand.enabled': false,
        'recording.enabled': false,
        'welcomepage.enabled': false,
        'invite.enabled': false,
      };
      const roomURL = `${settings.jitsiBaseURL}/${roomId}`;
      const userInfo = {displayName, email: '', avatar: ''};
      JitsiMeet.call(roomURL, userInfo, options, meetFeatureFlags);
    }, 1000);

    return () => {
      JitsiMeet.endCall();
    };
  }, [onVideoOn, onMute, subject, roomId, displayName]);

  const onConferenceTerminated = (event) => {
    setIsLoading(true);
    JitsiMeet.endCall();
    onEndCall();
  };

  const onConferenceJoined = (event) => {
    if (platform === 'ios') {
      setIsLoading(false);
    } else {
      setJitsiVisible(false);
      setTimeout(() => {
        setIsLoading(false);
        setJitsiVisible(true);
      }, 100);
    }
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
      {jitsiVisible && (
        <JitsiMeetView
          onConferenceTerminated={onConferenceTerminated}
          onConferenceJoined={onConferenceJoined}
          onConferenceWillJoin={onConferenceWillJoin}
          style={styles.videoMeetingWrapper}
        />
      )}
    </>
  );
};

export default AcceptCall;
