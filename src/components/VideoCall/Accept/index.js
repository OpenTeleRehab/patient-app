/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState, useRef, useContext} from 'react';
import RNCallKeep from 'react-native-callkeep';
import {
  AppState,
  NativeModules,
  Linking,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {TwilioVideo} from 'react-native-twilio-video-webrtc';
import {useDispatch, useSelector} from 'react-redux';
import {Icon, Text} from 'react-native-elements';
import {getLocalData} from '../../../utils/local_storage';
import {CALL_STATUS, STORAGE_KEY} from '../../../variables/constants';
import {clearCallAccessToken} from '../../../store/rocketchat/actions';
import {clearVideoCallStatus} from '../../../store/rocketchat/actions';
import {sendNewMessage, updateMessage} from '../../../utils/rocketchat';
import {generateHash, isPhcWorker} from '../../../utils/helper';
import {useCallContext} from '../../../context/CallContext';
import CommonPopup from '../../Common/Popup';
import RocketchatContext from '../../../context/RocketchatContext';
import ParticipantInvitation from './ParticipantInvitation';
import Participants from './Participants';
import LocalParticipant from './LocalParticipant';
import styles from '../../../assets/styles';
import _ from 'lodash';

const AcceptCall = ({
  translate,
  theme,
  isVideoOn,
  isSpeakerOn,
  isMute,
  onVideoOn,
  onSpeakerOn,
  onMute,
}) => {
  const dispatch = useDispatch();
  const twilioRef = useRef(null);
  const timerRef = useRef(null);
  const callStartRef = useRef(null);
  const chatSocket = useContext(RocketchatContext);
  const {ForegroundService} = NativeModules;
  const {isHostOwner, setHasParticipant} = useCallContext();
  const {callAccessToken, chatRooms, videoCall} = useSelector(
    (state) => state.rocketchat,
  );
  const {profile} = useSelector((state) => state.user);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('disconnected');
  const [participants, setParticipants] = useState([]);
  const [invitingParticipants, setInvitingParticipants] = useState([]);
  const [permissionSettingPopup, setPermissionSettingPopup] = useState(false);
  const [permissionMessagePopup, setPermissionMessagePopup] = useState('');
  const [forcePermissionMessagePopup, setForcePermissionMessagePopup] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true); // Prevent duplicate connections.
  const [isTranscripting, setIsTranscripting] = useState(false);
  const [transcriptedText, setTranscriptedText] = useState('');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    setHasParticipant(participants.length > 0);
  }, [participants, setHasParticipant]);

  useEffect(() => {
    if (callAccessToken) {
      setStatus('connecting');

      getLocalData(STORAGE_KEY.CALL_INFO, true)
        .then(async (callInfo) => {
          // Check if permissions are allowed; otherwise; do not enable specific features.
          let hasVoicePermission;

          if (Platform.OS === 'ios') {
            const micPermission = await request(PERMISSIONS.IOS.MICROPHONE);
            hasVoicePermission = micPermission === RESULTS.GRANTED;
          } else {
            hasVoicePermission = await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            );
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
              hasCameraPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.CAMERA,
              );
            }

            let videoOn = isVideoOn;

            if (!_.isEmpty(callInfo)) {
              videoOn = callInfo.body.includes('video');
            }

            twilioRef.current.connect({
              accessToken: callAccessToken,
              enableVideo: videoOn && hasCameraPermission,
              enableAudio: !isMute && hasVoicePermission,
            });

            if (Platform.OS === 'android') {
              twilioRef.current
                .setLocalVideoEnabled(videoOn && hasCameraPermission)
                .then((isEnabled) => setIsVideoEnabled(isEnabled));

              twilioRef.current
                .setLocalAudioEnabled(!isMute && hasVoicePermission)
                .then((isEnabled) => setIsAudioEnabled(isEnabled));
            } else {
              // Fix issue enabling video in audio call on iOS
              setTimeout(() => {
                twilioRef.current
                  .setLocalVideoEnabled(videoOn && hasCameraPermission)
                  .then((isEnabled) => setIsVideoEnabled(isEnabled));

                twilioRef.current
                  .setLocalAudioEnabled(!isMute && hasVoicePermission)
                  .then((isEnabled) => setIsAudioEnabled(isEnabled));
              }, 1500);
            }
          }
        })
        .finally(() => setIsConnecting(false));
    }
  }, [callAccessToken, isMute, isVideoOn]);

  useEffect(() => {
    // Listen AppState change
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        if (callAccessToken && !isConnecting && status !== 'connected') {
          setIsConnecting(true);

          getLocalData(STORAGE_KEY.CALL_INFO, true)
            .then(async (callInfo) => {
              // Check if permissions are allowed; otherwise; do not enable specific features.
              let hasVoicePermission;

              if (Platform.OS === 'ios') {
                const micPermission = await request(PERMISSIONS.IOS.MICROPHONE);
                hasVoicePermission = micPermission === RESULTS.GRANTED;
              } else {
                hasVoicePermission = await PermissionsAndroid.check(
                  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                );
              }

              if (!hasVoicePermission) {
                setForcePermissionMessagePopup(true);
                setPermissionMessagePopup('common.permissions.audio.message');
                setPermissionSettingPopup(true);
              } else {
                let hasCameraPermission;

                if (Platform.OS === 'ios') {
                  const cameraPermission = await request(
                    PERMISSIONS.IOS.CAMERA,
                  );
                  hasCameraPermission = cameraPermission === RESULTS.GRANTED;
                } else {
                  hasCameraPermission = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                  );
                }

                let videoOn = isVideoOn;

                if (!_.isEmpty(callInfo)) {
                  videoOn = callInfo.body.includes('video');
                }

                twilioRef.current.connect({
                  accessToken: callAccessToken,
                  enableVideo: videoOn && hasCameraPermission,
                  enableAudio: !isMute && hasVoicePermission,
                });

                twilioRef.current
                  .setLocalVideoEnabled(videoOn && hasCameraPermission)
                  .then((isEnabled) => setIsVideoEnabled(isEnabled));

                twilioRef.current
                  .setLocalAudioEnabled(!isMute && hasVoicePermission)
                  .then((isEnabled) => setIsAudioEnabled(isEnabled));

                setPermissionSettingPopup(false);
              }
            })
            .finally(() => setIsConnecting(false));
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [callAccessToken, isConnecting, isVideoOn, isMute, status]);

  const startCallTimer = () => {
    callStartRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const diff = Math.floor((Date.now() - callStartRef.current) / 1000);
      setCallDuration(diff);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const _onEndButtonPress = () => {
    // Disconnect from twilio call
    twilioRef.current.disconnect();

    if (isHostOwner) {
      participants.forEach(({participant}) => {
        const chatRoom = chatRooms.find((item) =>
          participant.identity.startsWith(item.u.username),
        );

        const _id = generateHash();
        const rid = chatRoom.rid;
        const text = CALL_STATUS.AUDIO_ENDED;

        // TODO: Update end call message
        sendNewMessage(chatSocket, {_id, rid, text}, profile.id);
      });

      invitingParticipants.forEach((participant) => {
        const _id = participant._id;
        const rid = participant.rid;
        const msg = CALL_STATUS.AUDIO_ENDED;

        updateMessage(chatSocket, {_id, rid, msg}, profile.id);
      });
    } else {
      const _id = videoCall._id;
      const rid = videoCall.rid;
      const msg = CALL_STATUS.AUDIO_ENDED;

      updateMessage(chatSocket, {_id, rid, msg}, profile.id);
    }
  };

  const _onRoomDidConnect = (connected) => {
    // Start call duration
    startCallTimer();

    setStatus('connected');

    // Get callUUID and end call keep
    getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
      callInfo?.callUUID && RNCallKeep.endCall(callInfo?.callUUID);
    });

    // Start foreground service
    ForegroundService.startService();
  };

  const _onRoomDidDisconnect = () => {
    // Stop call duration
    stopCallTimer();

    setStatus('disconnected');

    // Stop foreground service
    ForegroundService.stopService();

    // Cleanup call access token
    dispatch(clearCallAccessToken());

    // Cleanup video call status
    dispatch(clearVideoCallStatus());
  };

  const _onMuteButtonPress = async () => {
    let hasVoicePermission;
    let showMessage = false;
    if (Platform.OS === 'ios') {
      const micPermission = await request(PERMISSIONS.IOS.MICROPHONE);
      hasVoicePermission = micPermission === RESULTS.GRANTED;
      showMessage = micPermission === RESULTS.BLOCKED;
    } else {
      hasVoicePermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
    }

    if (!hasVoicePermission) {
      if (Platform.OS === 'android') {
        const isAllowedStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
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
      hasCameraPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
    }

    if (!hasCameraPermission) {
      if (Platform.OS === 'android') {
        const isAllowedStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        hasCameraPermission = isAllowedStatus === 'granted';
        showMessage = isAllowedStatus === 'never_ask_again';
      }

      if (showMessage) {
        setForcePermissionMessagePopup(false);
        setPermissionMessagePopup('common.permissions.video.message');
        setPermissionSettingPopup(true);
      }
    }

    twilioRef.current
      .setLocalVideoEnabled(!isVideoEnabled && hasCameraPermission)
      .then((isEnabled) => {
        setIsVideoEnabled(isEnabled);
        if (Platform.OS === 'ios') {
          if (!isEnabled) {
            twilioRef.current.unpublishLocalVideo();
          } else {
            // Fix issue enabling video in audio call on iOS, but the issue still occurs sometimes when toggling multi times.
            twilioRef.current.unpublishLocalVideo();
            setTimeout(() => {
              twilioRef.current.publishLocalVideo();
            }, 1000);
          }
        }
      });
  };

  const _onClosedCaptionClick = async () => {
    setIsTranscripting(!isTranscripting);
  };

  const _onRoomDidFailToConnect = () => {
    setStatus('disconnected');
  };

  const _onRoomParticipantDidConnect = (participant) => {
    setParticipants([...participants, participant]);
  };

  const _onRoomParticipantDidDisconnect = (participant) => {
    const items = participants.filter(
      (item) => item.participant.sid !== participant.participant.sid,
    );

    setParticipants(items);

    if (!isHostOwner && items.length === 0) {
      setTimeout(() => {
        // Disconnect from twilio call
        twilioRef?.current?.disconnect();
      }, 2000);
    }
  };

  const _onParticipantAddedVideoTrack = (participant) => {
    const sid = participant.participant.sid;
    setParticipants((prev) => [
      ...prev.filter((item) => item.participant.sid !== sid),
      participant,
    ]);
  };

  const _onParticipantRemovedVideoTrack = (participant) => {
    setParticipants((prevParticipant) =>
      prevParticipant.map((item) => {
        if (item.participant.sid !== participant.participant.sid) {
          return item;
        }
        const {track, ...rest} = item;
        return rest;
      }),
    );
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
      getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
        try {
          callInfo.callUUID && RNCallKeep.endCall(callInfo.callUUID);
        } catch {}
      });
      _onEndButtonPress();
    }
    setPermissionSettingPopup(false);
  };

  return (
    <View style={styles.acceptCallContainer}>
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
          <LocalParticipant
            isVideoEnabled={isVideoEnabled}
            callDuration={callDuration}
            participants={participants}
          />
          <Participants participants={participants} />

          {isHostOwner && (
            <ParticipantInvitation
              isVideoEnabled={isVideoEnabled}
              participants={participants}
              onSetInvitingParticipants={setInvitingParticipants}
            />
          )}
        </>
      )}

      {(status === 'connected' || status === 'connecting') && (
        <>
          {isTranscripting && (
            <View style={styles.callTranscriptWrapper}>
              <Text style={styles.callTranscript}>{transcriptedText}</Text>
            </View>
          )}
          <View style={styles.callOptions}>
            <TouchableOpacity onPress={_onMuteButtonPress}>
              <Icon
                reverse
                type="feather"
                name={isAudioEnabled ? 'mic' : 'mic-off'}
                color={isAudioEnabled ? theme.colors.dark : theme.colors.danger}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={_onEndButtonPress}>
              <Icon
                reverse
                type="material-icons"
                name="call-end"
                color={theme.colors.danger}
                size={38}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={_onCameraDidStart}>
              <Icon
                reverse
                type="feather"
                name={isVideoEnabled ? 'video' : 'video-off'}
                color={isVideoEnabled ? theme.colors.dark : theme.colors.danger}
                size={24}
              />
            </TouchableOpacity>
            {!isPhcWorker(profile.type) && (
              <TouchableOpacity onPress={_onClosedCaptionClick}>
                <Icon
                  reverse
                  type="material-icons"
                  name={
                    isTranscripting
                      ? 'closed-caption'
                      : 'closed-caption-disabled'
                  }
                  color={
                    isTranscripting ? theme.colors.dark : theme.colors.danger
                  }
                  size={22}
                />
              </TouchableOpacity>
            )}
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
