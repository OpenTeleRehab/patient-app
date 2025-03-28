/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState, useRef} from 'react';
import {AppState, Linking, ScrollView, TouchableOpacity, View, Platform, PermissionsAndroid} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Icon, Text} from 'react-native-elements';
import _ from 'lodash';
import {getLocalData} from '../../../utils/local_storage';
import {User} from '../../../services/user';
import {STORAGE_KEY} from '../../../variables/constants';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import CommonPopup from '../../Common/Popup';
import {clearVideoCallStatus} from '../../../store/rocketchat/actions';
import RNCallKeep from 'react-native-callkeep';

const AcceptCall = ({
  theme,
  onEndCall,
  onVideoOn,
  onSpeakerOn,
  onMute,
  identity,
  roomId,
}) => {
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const twilioRef = useRef(null);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {videoCall} = useSelector((state) => state.rocketchat);
  const {isChatConnected} = useSelector((state) => state.indicator);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState([]);
  const [permissionSettingPopup, setPermissionSettingPopup] = useState(false);
  const [permissionMessagePopup, setPermissionMessagePopup] = useState('');
  const [forcePermissionMessagePopup, setForcePermissionMessagePopup] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true); // Prevent duplicate connections.
  const [isTranscripting, setIsTranscripting] = useState(false);
  const [transcriptedText, setTranscriptedText] = useState('');

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
            let hasVoicePermission;
            if (Platform.OS === 'ios') {
              const micPermission = await request(PERMISSIONS.IOS.MICROPHONE);
              hasVoicePermission = micPermission === RESULTS.GRANTED;
            } else {
              hasVoicePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
            }

            if (!hasVoicePermission) {
              setForcePermissionMessagePopup(true);
              setPermissionMessagePopup('common.permissions.audio.message');
              setPermissionSettingPopup(true);
            } else {
              let hasCameraPermission;
              if (Platform.OS === 'ios') {
                const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
                hasCameraPermission = cameraPermission === RESULTS.GRANTED;
              } else {
                hasCameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
              }
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
                let hasVoicePermission;
                if (Platform.OS === 'ios') {
                  const micPermission = await request(PERMISSIONS.IOS.MICROPHONE);
                  hasVoicePermission = micPermission === RESULTS.GRANTED;
                } else {
                  hasVoicePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
                }

                if (!hasVoicePermission) {
                  setForcePermissionMessagePopup(true);
                  setPermissionMessagePopup('common.permissions.audio.message');
                  setPermissionSettingPopup(true);
                } else {
                  let hasCameraPermission;
                  if (Platform.OS === 'ios') {
                    const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
                    hasCameraPermission = cameraPermission === RESULTS.GRANTED;
                  } else {
                    hasCameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
                  }
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
      getLocalData(STORAGE_KEY.CALL_INFO, true).then(callInfo => {
        try {
          callInfo.callUUID && RNCallKeep.endCall(callInfo.callUUID);
        } catch {}
      });
    setStatus('connected');
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
    getLocalData(STORAGE_KEY.CALL_INFO, true).then(callInfo => {
      try {
        callInfo.callUUID && RNCallKeep.endCall(callInfo.callUUID);
      } catch {}
    });
    onEndCall();
    if (!netInfo.isConnected) {
      setStatus('disconnected');
      dispatch(clearVideoCallStatus());
    }
  };

  const _onMuteButtonPress = async () => {
    let hasVoicePermission;
    let showMessage = false;
    if (Platform.OS === 'ios') {
      const micPermission = await request(PERMISSIONS.IOS.MICROPHONE);
      hasVoicePermission = micPermission === RESULTS.GRANTED;
      showMessage = micPermission === RESULTS.BLOCKED;
    } else {
      hasVoicePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    }

    if (!hasVoicePermission) {
      if (Platform.OS === 'android') {
        const isAllowedStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        hasVoicePermission = isAllowedStatus === 'granted';
        showMessage = isAllowedStatus === 'never_ask_again';
      }

      if (showMessage) {
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
    let hasCameraPermission;
    let showMessage = false;
    if (Platform.OS === 'ios') {
      const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      hasCameraPermission = cameraPermission === RESULTS.GRANTED;
      showMessage = cameraPermission === RESULTS.BLOCKED;
    } else {
      hasCameraPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    if (!hasCameraPermission) {
      if (Platform.OS === 'android') {
        const isAllowedStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        hasCameraPermission = isAllowedStatus === 'granted';
        showMessage = isAllowedStatus === 'never_ask_again';
      }

      if (showMessage) {
        setForcePermissionMessagePopup(false);
        setPermissionMessagePopup('common.permissions.camera.message');
        setPermissionSettingPopup(true);
      }
    }

    twilioRef.current
      .setLocalVideoEnabled(!isVideoEnabled && hasCameraPermission)
      .then((isEnabled) => setIsVideoEnabled(isEnabled));
  };

  const _onClosedCaptionClick = async () => {
    setIsTranscripting(!isTranscripting);
  };

  const _onRoomDidDisconnect = () => {
    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = () => {
    setStatus('disconnected');
  };

  const _onRoomParticipantDidConnect = participant => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const _onRoomParticipantDidDisconnect = participant => {
    setParticipants((prevParticipants) => prevParticipants.filter(item => item.participant.identity !== participant.participant.identity));
  };

  const _onParticipantAddedVideoTrack = participant => {
    setParticipants((prevParticipants) => [
      ...prevParticipants.filter(item => item.participant.identity !== participant.participant.identity),
      participant,
    ]);
  };

  const _onParticipantRemovedVideoTrack = participant => {
    participants.forEach(item => item.participant.identity === participant.participant.identity && delete item.track);

    setParticipants(participants);
  };

  const _onDataTrackMessageReceived = (data) => {
    if (data?.message) {
      setTranscriptedText(data?.message);
    }
  };

  const handleConfirmPermissionPopup = () => {
    Linking.openSettings();
    if (!forcePermissionMessagePopup) {
      setPermissionSettingPopup(false);
    }
  };

  const handleCancelPermissionPopup = () => {
    if (forcePermissionMessagePopup) {
      getLocalData(STORAGE_KEY.CALL_INFO, true).then(callInfo => {
        try {
          callInfo.callUUID && RNCallKeep.endCall(callInfo.callUUID);
        } catch {}
      });
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

          <ScrollView horizontal style={styles.participantContainer}>
            {participants.length === 0 && (
              <View style={styles.participantItem}>
                <Icon
                  reverse
                  name="user-alt"
                  type="font-awesome-5"
                  color={theme.colors.black}
                />
              </View>
            )}

            {participants.length > 0 && Array.from(participants, ({participant, track}) => (
              <View key={participant.identity} style={styles.participantItem}>
                {!isChatConnected && (
                  <Text style={styles.callMessage}>
                    {translate('call_message.trying_to_reconnect')}
                  </Text>
                )}
                {track ? (
                  <TwilioVideoParticipantView
                    trackIdentifier={{
                      participantSid: participant.sid,
                      videoTrackSid: track.trackSid,
                    }}
                    style={styles.participantView}
                  />
                ) : (
                  <Avatar
                    size={50}
                    rounded
                    title={participant.identity?.charAt(0)}
                    containerStyle={{backgroundColor: theme.colors.primary}}
                  />
                )}
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {(status === 'connected' || status === 'connecting') && (
        <>
          {isTranscripting && (
            <View style={styles.callTranscriptWrapper}>
              <Text style={styles.callTranscript}>
                {transcriptedText}
              </Text>
            </View>
          )}
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

            <TouchableOpacity
              onPress={_onClosedCaptionClick}
              style={styles.optionButton}>
              <Icon
                type="material-icons"
                name={isTranscripting ? 'closed-caption' : 'closed-caption-disabled'}
                color={theme.colors.white}
                size={22}
                style={[
                  styles.callOptionIcon,
                  isTranscripting ? styles.bgDark : styles.bgDanger,
                ]}
              />
            </TouchableOpacity>
          </View>
        </>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomParticipantDidConnect={_onRoomParticipantDidConnect}
        onRoomParticipantDidDisconnect={_onRoomParticipantDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
        onDataTrackMessageReceived={_onDataTrackMessageReceived}
      />
    </View>
  );
};

export default AcceptCall;
