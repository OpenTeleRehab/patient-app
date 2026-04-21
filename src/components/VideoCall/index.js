/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Modal, NativeModules, Platform} from 'react-native';
import {withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {CALL_STARTED_STATUSES, CALL_STATUS, STORAGE_KEY} from '../../variables/constants';
import IncomingCall from './Incoming';
import AcceptCall from './Accept';
import {getLocalData} from '../../utils/local_storage';

const VideoCall = ({theme}) => {
  const {callAccessToken, videoCall, showIncomingCall, showAcceptedCall} = useSelector((state) => state.rocketchat);
  const {ForegroundService} = NativeModules;
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {accessToken} = useSelector((state) => state.user);
  const [isVideoOn, setIsVideoOn] = useState(undefined);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showIncomingCall) {
      setTimeout(() => {
        getLocalData(STORAGE_KEY.CALL_INFO, true).then((response) => {
          if (Object.keys(response).length === 0) {
            setShowModal(true);
          }
        });
      }, 1000);
    } else {
      setShowModal(false);

      if (Platform.OS === 'android') {
        ForegroundService.stopService();
      }
    }

    if (accessToken && showAcceptedCall) {
      setShowModal(true);
    } else {
      setShowModal(false);

      if (Platform.OS === 'android') {
        ForegroundService.stopService();
      }
    }
  }, [ForegroundService, accessToken, showAcceptedCall, showIncomingCall]);

  useEffect(() => {
    if (CALL_STARTED_STATUSES.includes(videoCall?.status) && !callAccessToken) {
      setIsVideoOn(videoCall.status === CALL_STATUS.VIDEO_STARTED);
    }
  }, [videoCall, callAccessToken]);

  return (
    <Modal transparent={false} visible={showModal}>
      {showIncomingCall && !callAccessToken && (
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
      {showAcceptedCall && callAccessToken && (
        <AcceptCall
          translate={translate}
          theme={theme}
          isVideoOn={isVideoOn}
          isMute={isMute}
        />
      )}
    </Modal>
  );
};

export default withTheme(VideoCall);
