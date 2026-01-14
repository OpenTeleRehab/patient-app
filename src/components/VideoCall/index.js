/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Modal, StatusBar} from 'react-native';
import {withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {CALL_STARTED_STATUSES, CALL_STATUS} from '../../variables/constants';
import IncomingCall from './Incoming';
import AcceptCall from './Accept';

const VideoCall = ({theme}) => {
  const {callAccessToken, videoCall} = useSelector((state) => state.rocketchat);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [isVideoOn, setIsVideoOn] = useState(undefined);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (videoCall.status?.startsWith('jitsi_call')) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [callAccessToken, videoCall]);

  useEffect(() => {
    if (CALL_STARTED_STATUSES.includes(videoCall.status) && !isVideoOn) {
      setIsVideoOn(videoCall.status === CALL_STATUS.VIDEO_STARTED);
    }
  }, [videoCall, isVideoOn]);

  return (
    <Modal animationType="fade" transparent={false} visible={showModal}>
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
