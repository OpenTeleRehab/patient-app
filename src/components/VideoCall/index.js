/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useState} from 'react';
import {Modal} from 'react-native';
import {withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import JitsiMeet from '@webessentials/react-native-jitsi-meet';
import IncomingCall from './Incoming';
import AcceptCall from './Accept';
import {CALL_STATUS} from '../../variables/constants';
import RocketchatContext from '../../context/RocketchatContext';
import {updateMessage} from '../../utils/rocketchat';

const VideoCall = ({theme}) => {
  const chatSocket = useContext(RocketchatContext);
  const {videoCall, secondaryVideoCall} = useSelector(
    (state) => state.rocketchat,
  );
  const {profile, accessToken} = useSelector((state) => state.user);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (
      videoCall.rid &&
      [
        // CALL_STATUS.VIDEO_STARTED,
        // CALL_STATUS.AUDIO_STARTED,
        CALL_STATUS.ACCEPTED,
        CALL_STATUS.BUSY,
      ].includes(videoCall.status)
    ) {
      setShowModal(true);
    } else {
      JitsiMeet.endCall();
      setShowModal(false);
    }
  }, [videoCall, accessToken]);

  useEffect(() => {
    if (
      secondaryVideoCall.rid &&
      [CALL_STATUS.VIDEO_STARTED, CALL_STATUS.AUDIO_STARTED].includes(
        secondaryVideoCall.status,
      )
    ) {
      const message = {
        _id: secondaryVideoCall._id,
        rid: secondaryVideoCall.rid,
        msg: CALL_STATUS.BUSY,
      };
      updateMessage(chatSocket, message, profile.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondaryVideoCall]);

  const onAcceptCall = () => {
    handleUpdateMessage(CALL_STATUS.ACCEPTED);
  };

  const onEndCall = () => {
    handleUpdateMessage(
      videoCall.status === CALL_STATUS.VIDEO_ENDED
        ? CALL_STATUS.VIDEO_ENDED
        : CALL_STATUS.AUDIO_ENDED,
    );
  };

  const onDeclineCall = () => {
    handleUpdateMessage(
      videoCall.status === CALL_STATUS.VIDEO_MISSED
        ? CALL_STATUS.VIDEO_MISSED
        : CALL_STATUS.AUDIO_MISSED,
    );
  };

  const handleUpdateMessage = (msg) => {
    const message = {
      _id: videoCall._id,
      rid: videoCall.rid,
      msg,
    };
    updateMessage(chatSocket, message, profile.id);
  };

  return (
    <Modal animationType="fade" transparent={false} visible={showModal}>
      {videoCall.status === CALL_STATUS.ACCEPTED ? (
        <AcceptCall
          onEndCall={onEndCall}
          onVideoOn={isVideoOn}
          onSpeakerOn={isSpeakerOn}
          onMute={isMute}
          theme={theme}
          loadingText={translate('common.loading')}
          roomId={videoCall.rid}
          subject={videoCall.u.name}
          displayName={`${profile.last_name} ${profile.first_name}`}
        />
      ) : videoCall.status === CALL_STATUS.AUDIO_STARTED ||
        videoCall.status === CALL_STATUS.VIDEO_STARTED ? (
        <IncomingCall
          onAcceptCall={onAcceptCall}
          onDeclineCall={onDeclineCall}
          onVideoOn={setIsVideoOn}
          onSpeakerOn={setIsSpeakerOn}
          onMute={setIsMute}
          translate={translate}
          theme={theme}
          callName={videoCall.u.name}
        />
      ) : null}
    </Modal>
  );
};

export default withTheme(VideoCall);
