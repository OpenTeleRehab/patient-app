/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState, useRef} from 'react';
import {
  AppState,
  Linking,
  PermissionsAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Icon, Text} from 'react-native-elements';
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
import {getTranslate} from 'react-localize-redux';
import CommonPopup from '../../Common/Popup';
import {clearVideoCallStatus} from '../../../store/rocketchat/actions';
import {useNetInfo} from '@react-native-community/netinfo';

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
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const twilioRef = useRef(null);
  const {videoCall} = useSelector((state) => state.rocketchat);
  const {isChatConnected} = useSelector((state) => state.indicator);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [videoTracks, setVideoTracks] = useState(new Map());
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [permissionSettingPopup, setPermissionSettingPopup] = useState(false);
  const [permissionMessagePopup, setPermissionMessagePopup] = useState('');
  const [forcePermissionMessagePopup, setForcePermissionMessagePopup] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true); // Prevent duplicate connections.

  useEffect(() => {
    if (_.isEmpty(videoCall)) {
      twilioRef.current.disconnect();
    }
  }, [videoCall]);

  useEffect(() => {
    if (roomId && identity) {
      User.getCallAccessToken(roomId, identity).then((response) => {
        if (response.success) {
          getLocalData(STORAGE_KEY.CALL_INFO, true).then(async (callInfo) => {
            // Check if permissions are allowed; otherwise; do not enable specific features.
            let hasVoicePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
            if (!hasVoicePermission) {
              setForcePermissionMessagePopup(true);
              setPermissionMessagePopup('common.permissions.audio.message');
              setPermissionSettingPopup(true);
            } else {
              const hasCameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
              let videoOn = onVideoOn;

              if (!_.isEmpty(callInfo)) {
                videoOn = callInfo.body.includes('video');
              }

              twilioRef.current.connect({
                accessToken: response.token,
                enableVideo: hasCameraPermission,
                enableAudio: hasVoicePermission,
              });

              twilioRef.current
                .setLocalVideoEnabled(videoOn && hasCameraPermission)
                .then((isEnabled) => setIsVideoEnabled(isEnabled));

              twilioRef.current
                .setLocalAudioEnabled(!onMute && hasVoicePermission)
                .then((isEnabled) => setIsAudioEnabled(isEnabled));
            }
          }).finally(() => setIsConnecting(false));

          setStatus('connecting');
        }
      }).finally(() => setIsConnecting(false));
    }
  }, [onMute, onVideoOn, roomId, identity]);

  useEffect(() => {
    // Listen AppState change
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        if (roomId && identity && status !== 'connected' && !isConnecting) {
          setIsConnecting(true);
          User.getCallAccessToken(roomId, identity).then((response) => {
            if (response.success) {
              getLocalData(STORAGE_KEY.CALL_INFO, true).then(async (callInfo) => {
                // Check if permissions are allowed; otherwise; do not enable specific features.
                let hasVoicePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
                if (!hasVoicePermission) {
                  setForcePermissionMessagePopup(true);
                  setPermissionMessagePopup('common.permissions.audio.message');
                  setPermissionSettingPopup(true);
                } else {
                  const hasCameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
                  let videoOn = onVideoOn;

                  if (!_.isEmpty(callInfo)) {
                    videoOn = callInfo.body.includes('video');
                  }

                  twilioRef.current.connect({
                    accessToken: response.token,
                    enableVideo: hasCameraPermission,
                    enableAudio: hasVoicePermission,
                  });

                  twilioRef.current
                    .setLocalVideoEnabled(videoOn && hasCameraPermission)
                    .then((isEnabled) => setIsVideoEnabled(isEnabled));

                  twilioRef.current
                    .setLocalAudioEnabled(!onMute && hasVoicePermission)
                    .then((isEnabled) => setIsAudioEnabled(isEnabled));

                  setPermissionSettingPopup(false);
                }
              }).finally(() => setIsConnecting(false));

              setStatus('connecting');
            }
          }).finally(() => setIsConnecting(false));
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [identity, isConnecting, onMute, onVideoOn, roomId, status]);

  const _onRoomDidConnect = () => {
    setStatus('connected');
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
    onEndCall();
    if (!netInfo.isConnected) {
      setStatus('disconnected');
      dispatch(clearVideoCallStatus());
    }
  };

  const _onMuteButtonPress = async () => {
    let hasVoicePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (!hasVoicePermission) {
      const isAllowedStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      hasVoicePermission = isAllowedStatus === 'granted';

      if (isAllowedStatus === 'never_ask_again') {
        setForcePermissionMessagePopup(false);
        setPermissionMessagePopup('common.permissions.audio.message');
        setPermissionSettingPopup(true);
      }
    }

    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled && hasVoicePermission)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onCameraDidStart = async () => {
    let hasCameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (!hasCameraPermission) {
      const isAllowedStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      hasCameraPermission = isAllowedStatus === 'granted';

      if (isAllowedStatus === 'never_ask_again') {
        setForcePermissionMessagePopup(false);
        setPermissionMessagePopup('common.permissions.camera.message');
        setPermissionSettingPopup(true);
      }
    }

    twilioRef.current
      .setLocalVideoEnabled(!isVideoEnabled && hasCameraPermission)
      .then((isEnabled) => setIsVideoEnabled(isEnabled));
  };

  const _onRoomDidDisconnect = (disconnected) => {
    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = (failed) => {
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

  const handleConfirmPermissionPopup = () => {
    Linking.openSettings();
    if (!forcePermissionMessagePopup) {
      setPermissionSettingPopup(false);
    }
  };

  const handleCancelPermissionPopup = () => {
    if (forcePermissionMessagePopup) {
      _onEndButtonPress();
    }
    setPermissionSettingPopup(false);
  };

  return (
    <View style={[styles.callContainer, styles.bgBlack]}>
      <CommonPopup
        popup={permissionSettingPopup}
        iconType="material"
        iconName="perm-camera-mic"
        onConfirm={handleConfirmPermissionPopup}
        tittle={translate('app.permission.setting.title')}
        message={translate(permissionMessagePopup)}
        onCancel={handleCancelPermissionPopup}
      />
      {status === 'connected' && (
        <>
          <View style={styles.participantContainer}>
            {!isChatConnected && (
              <Text style={styles.callMessage}>
                {translate('call_message.trying_to_reconnect')}
              </Text>
            )}

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
