/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Modal, NativeModules, StatusBar} from 'react-native';
import {withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {CALL_STARTED_STATUSES, CALL_STATUS} from '../../variables/constants';
import IncomingCall from './Incoming';
import AcceptCall from './Accept';

const VideoCall = ({theme}) => {
  const {ForegroundService} = NativeModules;
  const {callAccessToken, videoCall} = useSelector((state) => state.rocketchat);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {accessToken} = useSelector((state) => state.user);
  const [isVideoOn, setIsVideoOn] = useState(undefined);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (videoCall.status?.startsWith('jitsi_call')) {
      if (videoCall.status === CALL_STATUS.ACCEPTED && !accessToken) {
        // Ensure foreground service stopped
        ForegroundService.stopService();

        // Need to enter pin to unlock accept call
        setShowModal(false);
      } else {
        setShowModal(true);
      }
    } else {
      setShowModal(false);

      // Ensure foreground service stopped
      ForegroundService.stopService();
    }
  }, [ForegroundService, accessToken, callAccessToken, videoCall]);

  useEffect(() => {
    if (CALL_STARTED_STATUSES.includes(videoCall.status)) {
      setIsVideoOn(videoCall.status === CALL_STATUS.VIDEO_STARTED);
    }
  }, [videoCall]);

  return (
    <Modal transparent={false} visible={showModal}>
      <StatusBar
        backgroundColor={theme.colors.success}
        barStyle="light-content"
      />

      {callAccessToken && (
        <AcceptCall
          translate={translate}
          theme={theme}
          isVideoOn={isVideoOn}
          isSpeakerOn={isSpeakerOn}
          isMute={isMute}
          onVideoOn={() => setIsVideoOn(!isVideoOn)}
          onSpeakerOn={() => setIsSpeakerOn(!isSpeakerOn)}
          onMute={() => setIsMute(!isMute)}
        />
      )}

      {!callAccessToken && CALL_STARTED_STATUSES.includes(videoCall.status) && (
        <IncomingCall
          translate={translate}
          theme={theme}
          isVideoOn={isVideoOn}
          isSpeakerOn={isSpeakerOn}
          isMute={isMute}
          onVideoOn={() => setIsVideoOn(!isVideoOn)}
          onSpeakerOn={() => setIsSpeakerOn(!isSpeakerOn)}
          onMute={() => setIsMute(!isMute)}
        />
      )}
    </Modal>
  );
};

export default withTheme(VideoCall);
