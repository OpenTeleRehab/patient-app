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
  const {videoCall, selectedRoom} = useSelector((state) => state.rocketchat);
  const patient = useSelector((state) => state.user.profile);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const chatRoom = selectedRoom || {};

  useEffect(() => {
    if (
      chatRoom.rid &&
      videoCall !== undefined &&
      [CALL_STATUS.STARTED, CALL_STATUS.ACCEPTED].includes(videoCall.status)
    ) {
      setShowModal(true);
    } else {
      JitsiMeet.endCall();
      setShowModal(false);
    }
  }, [videoCall, chatRoom]);

  const onAcceptCall = () => {
    handleUpdateMessage(CALL_STATUS.ACCEPTED);
  };

  const onEndCall = () => {
    console.log('on end call');
    handleUpdateMessage(CALL_STATUS.ENDED);
  };

  const onDeclineCall = () => {
    handleUpdateMessage(CALL_STATUS.MISSED);
  };

  const handleUpdateMessage = (msg) => {
    const message = {
      _id: videoCall._id,
      rid: chatRoom.rid,
      msg,
    };
    updateMessage(chatSocket, message, patient.id);
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
          roomId={chatRoom.rid}
          subject={chatRoom.name}
          displayName={`${patient.last_name} ${patient.first_name}`}
        />
      ) : (
        <IncomingCall
          onAcceptCall={onAcceptCall}
          onDeclineCall={onDeclineCall}
          onVideoOn={setIsVideoOn}
          onSpeakerOn={setIsSpeakerOn}
          onMute={setIsMute}
          translate={translate}
          theme={theme}
          callName={chatRoom.name}
        />
      )}
    </Modal>
  );
};

export default withTheme(VideoCall);
