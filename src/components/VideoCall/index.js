/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useState} from 'react';
import {Modal} from 'react-native';
import {withTheme} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import IncomingCall from './Incoming';
import AcceptCall from './Accept';
import {CALL_STATUS, STORAGE_KEY} from '../../variables/constants';
import RocketchatContext from '../../context/RocketchatContext';
import {updateMessage} from '../../utils/rocketchat';
import {storeLocalData} from '../../utils/local_storage';

const VideoCall = ({theme}) => {
  const chatSocket = useContext(RocketchatContext);
  const {videoCall} = useSelector((state) => state.rocketchat);
  const {profile, accessToken} = useSelector((state) => state.user);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(false);

    if (
      videoCall &&
      videoCall.rid &&
      [
        CALL_STATUS.VIDEO_STARTED,
        CALL_STATUS.AUDIO_STARTED,
        CALL_STATUS.BUSY,
      ].includes(videoCall.status)
    ) {
      setShowModal(true);
    }

    if (accessToken && videoCall && videoCall.status === CALL_STATUS.ACCEPTED) {
      setShowModal(true);
    }
  }, [videoCall, accessToken]);

  const onAcceptCall = () => {
    storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
    handleUpdateMessage(CALL_STATUS.ACCEPTED);
  };

  const onEndCall = () => {
    storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
    handleUpdateMessage(
      videoCall.status === CALL_STATUS.VIDEO_ENDED
        ? CALL_STATUS.VIDEO_ENDED
        : CALL_STATUS.AUDIO_ENDED,
    );
  };

  const onDeclineCall = () => {
    storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
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
      {videoCall.status === CALL_STATUS.AUDIO_STARTED ||
      videoCall.status === CALL_STATUS.VIDEO_STARTED ? (
        <IncomingCall
          onAcceptCall={onAcceptCall}
          onDeclineCall={onDeclineCall}
          onVideoOn={setIsVideoOn}
          onSpeakerOn={setIsSpeakerOn}
          onMute={setIsMute}
          translate={translate}
          theme={theme}
          callName={videoCall?.u.name}
        />
      ) : (
        <AcceptCall
          theme={theme}
          onEndCall={onEndCall}
          onVideoOn={isVideoOn}
          onSpeakerOn={isSpeakerOn}
          onMute={isMute}
          identity={profile.identity}
          roomId={videoCall?.u?._id}
        />
      )}
    </Modal>
  );
};

export default withTheme(VideoCall);
