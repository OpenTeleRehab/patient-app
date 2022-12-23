/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState, useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Icon} from 'react-native-elements';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import _ from 'lodash';
import {getLocalData} from '../../../utils/local_storage';
import {User} from '../../../services/user';
import {STORAGE_KEY} from '../../../variables/constants';
import styles from '../../../assets/styles';

const AcceptCall = ({
  theme,
  roomId,
  onEndCall,
  onVideoOn,
  onSpeakerOn,
  onMute,
}) => {
  const twilioRef = useRef(null);
  const {accessToken} = useSelector((state) => state.user);
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
    if (accessToken && roomId) {
      User.getCallAccessToken(roomId, accessToken).then((response) => {
        if (response.success) {
          twilioRef.current.connect({accessToken: response.token});

          getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
            let videoOn = onVideoOn;

            if (!_.isEmpty(callInfo)) {
              videoOn = callInfo.body.includes('video');
            }

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
  }, [accessToken, onMute, onVideoOn, roomId]);

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

  const _onParticipantRemovedVideoTrack = ({track}) => {
    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);
    setVideoTracks(videoTracksLocal);
  };

  return (
    <View style={[styles.callContainer, styles.bgBlack]}>
      {status === 'connected' && (
        <>
          <View style={styles.participantContainer}>
            {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
              return (
                <TwilioVideoParticipantView
                  style={styles.participantView}
                  key={trackSid}
                  trackIdentifier={trackIdentifier}
                />
              );
            })}
          </View>

          <View style={styles.localVideoContainer}>
            <TwilioVideoLocalView
              enabled
              applyZOrder
              style={styles.localVideoView}
            />
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
        onCameraDidStart={_onCameraDidStart}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </View>
  );
};

export default AcceptCall;
