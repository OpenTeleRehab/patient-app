/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState, useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Avatar, Icon} from 'react-native-elements';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from '@webessentials/react-native-twilio-video-webrtc';
import _ from 'lodash';
import {getLocalData} from '../../../utils/local_storage';
import {User} from '../../../services/user';
import {STORAGE_KEY} from '../../../variables/constants';
import styles from '../../../assets/styles';

const AcceptCall = ({
  theme,
  onEndCall,
  onVideoOn,
  onSpeakerOn,
  onMute,
  identity,
  roomId,
  callName,
}) => {
  const twilioRef = useRef(null);
  const {videoCall} = useSelector((state) => state.rocketchat);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [videoTracks, setVideoTracks] = useState(new Map());

  useEffect(() => {
    if (_.isEmpty(videoCall)) {
      twilioRef.current.disconnect();
    }
  }, [videoCall]);

  useEffect(() => {
    if (roomId && identity) {
      User.getCallAccessToken(roomId, identity).then((response) => {
        if (response.success) {
          getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
            let videoOn = onVideoOn;

            if (!_.isEmpty(callInfo)) {
              videoOn = callInfo.body.includes('video');
            }

            twilioRef.current.connect({
              accessToken: response.token,
              enableVideo: true,
              enableAudio: true,
            });

            twilioRef.current
              .setLocalVideoEnabled(videoOn)
              .then((isEnabled) => setIsVideoEnabled(isEnabled));

            twilioRef.current
              .setLocalAudioEnabled(!onMute)
              .then((isEnabled) => setIsAudioEnabled(isEnabled));
          });

          setStatus('connecting');
        }
      });
    }
  }, [onMute, onVideoOn, roomId, identity]);

  const _onRoomDidConnect = () => {
    setStatus('connected');
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
    onEndCall();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onCameraDidStart = () => {
    twilioRef.current
      .setLocalVideoEnabled(!isVideoEnabled)
      .then((isEnabled) => setIsVideoEnabled(isEnabled));
  };

  const _onRoomDidDisconnect = () => {
    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = () => {
    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({participant, track}) => {
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {
            participantSid: participant.sid,
            videoTrackSid: track.trackSid,
          },
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = () => {
    setVideoTracks(new Map());
  };

  return (
    <View style={[styles.callContainer, styles.bgBlack]}>
      {status === 'connected' && (
        <>
          <View style={styles.participantContainer}>
            <Avatar
              size={100}
              rounded
              title={callName?.charAt(0)}
              containerStyle={{backgroundColor: theme.colors.primary}}
            />

            {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
              return (
                <TwilioVideoParticipantView
                  key={trackSid}
                  trackIdentifier={trackIdentifier}
                  style={styles.participantView}
                />
              );
            })}
          </View>

          <View style={styles.localVideoContainer}>
            {isVideoEnabled ? (
              <TwilioVideoLocalView
                enabled
                applyZOrder
                style={styles.localVideoView}
              />
            ) : (
              <Icon
                reverse
                name="user-alt"
                type="font-awesome-5"
                color={theme.colors.black}
              />
            )}
          </View>
        </>
      )}

      {(status === 'connected' || status === 'connecting') && (
        <View style={styles.callOptions}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={_onMuteButtonPress}>
            <Icon
              type="feather"
              name={isAudioEnabled ? 'mic' : 'mic-off'}
              color={theme.colors.white}
              size={22}
              style={[
                styles.callOptionIcon,
                isAudioEnabled ? styles.bgDark : styles.bgDanger,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={_onEndButtonPress}>
            <Icon
              type="material-icons"
              name="call-end"
              color={theme.colors.white}
              size={32}
              style={[styles.callActionIcon, styles.bgDanger]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={_onCameraDidStart}
            style={styles.optionButton}>
            <Icon
              type="feather"
              name={isVideoEnabled ? 'video' : 'video-off'}
              color={theme.colors.white}
              size={22}
              style={[
                styles.callOptionIcon,
                isVideoEnabled ? styles.bgDark : styles.bgDanger,
              ]}
            />
          </TouchableOpacity>
        </View>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </View>
  );
};

export default AcceptCall;
