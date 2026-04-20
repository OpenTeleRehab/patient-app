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
  FlatList,
} from 'react-native';
import {
  TwilioVideo,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {Icon, Text} from 'react-native-elements';
import {getLocalData, storeLocalData} from '../../../utils/local_storage';
import {
  CALL_ENDED_STATUSES,
  CALL_STATUS,
  STORAGE_KEY,
} from '../../../variables/constants';
import {
  generateHash,
  getParticipantName,
  isPhcWorker,
} from '../../../utils/helper';
import {
  clearCallAccessToken,
  sendTextMessage,
  updateTextMessage,
} from '../../../store/rocketchat/actions';
import {clearVideoCallStatus} from '../../../store/rocketchat/actions';
import {useCallContext} from '../../../context/CallContext';
import {mutation} from '../../../store/rocketchat/mutations';
import CommonPopup from '../../Common/Popup';
import RocketchatContext from '../../../context/RocketchatContext';
import ParticipantInvitation from './ParticipantInvitation';
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
  const {setHasParticipant} = useCallContext();
  const {
    callAccessToken,
    chatRooms,
    videoCall,
    hasStartedCall,
    hasAcceptedCall,
  } = useSelector((state) => state.rocketchat);
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
    if (CALL_ENDED_STATUSES.includes(videoCall?.status) && callAccessToken) {
      if (hasAcceptedCall) {
        // Disconnect from twilio call
        twilioRef?.current?.disconnect();
      }

      if (hasStartedCall && participants.length === 0) {
        // Disconnect from twilio call
        twilioRef?.current?.disconnect();
      }
    }
  }, [
    callAccessToken,
    hasAcceptedCall,
    hasStartedCall,
    participants,
    videoCall,
  ]);

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

            twilioRef.current
              .setLocalVideoEnabled(videoOn && hasCameraPermission)
              .then((isEnabled) => setIsVideoEnabled(isEnabled));

            twilioRef.current
              .setLocalAudioEnabled(!isMute && hasVoicePermission)
              .then((isEnabled) => setIsAudioEnabled(isEnabled));
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

  const startForegroundService = () => {
    if (Platform.OS === 'android') {
      ForegroundService.startService();
    }
  };

  const stopForegroundService = () => {
    if (Platform.OS === 'android') {
      ForegroundService.stopService();
    }
  };

  const showTwilioVideoParticipantView = (track) => {
    if (track) {
      if (track.trackName === 'camera' && !track.enabled) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  };

  const _onEndButtonPress = () => {
    // Disconnect from twilio call
    twilioRef.current.disconnect();

    setTimeout(() => {
      // Stop foreground service
      stopForegroundService();

      // Cleanup call access token
      dispatch(clearCallAccessToken());

      dispatch(mutation.showIncomingCall(false));
      dispatch(mutation.showAcceptedCall(false));

      dispatch(mutation.hasStartedCall(false));
      dispatch(mutation.hasAcceptedCall(false));

      // Cleanup video call status
      dispatch(clearVideoCallStatus());
    }, 2000);

    if (hasStartedCall) {
      participants.forEach(({participant}) => {
        const chatRoom = chatRooms.find((item) =>
          participant.identity.includes(item.u.username + '###'),
        );

        if (chatRoom) {
          const message = {
            _id: generateHash(),
            rid: chatRoom.rid,
            user: {
              _id: chatRoom.u._id,
              username: chatRoom.u.username,
            },
            text:
              videoCall.status === CALL_STATUS.AUDIO_STARTED
                ? CALL_STATUS.AUDIO_ENDED
                : CALL_STATUS.VIDEO_ENDED,
          };
          dispatch(sendTextMessage(chatSocket, message, false));
        }
      });

      invitingParticipants.forEach((participant) => {
        const message = {
          _id: participant._id,
          rid: participant.rid,
          user: {
            _id: participant.u._id,
            username: participant.u.username,
          },
          text:
            videoCall.status === CALL_STATUS.AUDIO_STARTED
              ? CALL_STATUS.AUDIO_MISSED
              : CALL_STATUS.VIDEO_MISSED,
        };
        dispatch(updateTextMessage(chatSocket, message));
      });
    } else {
      const message = {
        _id: videoCall._id,
        rid: videoCall.rid,
        user: {
          _id: videoCall.u._id,
          username: videoCall.u.username,
        },
        text:
          videoCall.status === CALL_STATUS.AUDIO_STARTED
            ? CALL_STATUS.AUDIO_ENDED
            : CALL_STATUS.VIDEO_ENDED,
      };
      dispatch(updateTextMessage(chatSocket, message, false));
    }
  };

  const _onRoomDidConnect = (connected) => {
    // Start foreground service
    startForegroundService();

    // Start call duration
    startCallTimer();

    // Set status connected
    setStatus('connected');

    // Get callUUID and end call keep
    getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
      callInfo?.callUUID && RNCallKeep.endCall(callInfo?.callUUID);
    });

    if (Platform.OS === 'ios') {
      // Filter remote participants
      const remoteParticipants = connected.participants
        .filter((remote) => remote.sid !== connected.localParticipant.sid)
        .map((remote) => ({
          participant: remote,
          roomName: connected.roomName,
          roomSid: connected.roomSid,
        }));

      // Set remote participants
      setParticipants(remoteParticipants);
    }
  };

  const _onRoomDidDisconnect = (disconnect) => {
    if (disconnect.error) {
      return;
    }

    // Stop foreground service
    stopForegroundService();

    // Stop call duration
    stopCallTimer();

    // Set disconnected status
    setStatus('disconnected');

    // Cleanup call access token
    dispatch(clearCallAccessToken());

    // Cleanup video call status
    dispatch(clearVideoCallStatus());

    // Cleanup call info
    storeLocalData(STORAGE_KEY.CALL_INFO, {}, true).then();
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

        if (Platform.OS === 'ios' && isEnabled) {
          twilioRef.current.publishLocalVideo();
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
    setParticipants(
      participants.filter(
        (item) => item.participant.sid !== participant.participant.sid,
      ),
    );
  };

  const _onParticipantAddedVideoTrack = (participant) => {
    setParticipants((prev) => [
      ...prev.filter(
        (item) => item.participant.sid !== participant.participant.sid,
      ),
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

  const _onParticipantEnabledVideoTrack = (participant) => {
    if (
      Platform.OS === 'android' &&
      participant.track.trackName === 'camera' &&
      participant.track.enabled
    ) {
      setParticipants((prev) => [
        ...prev.filter(
          (item) => item.participant.sid !== participant.participant.sid,
        ),
        participant,
      ]);
    }
  };

  const _onParticipantDisabledVideoTrack = (participant) => {
    if (
      Platform.OS === 'android' &&
      participant.track.trackName === 'camera' &&
      !participant.track.enabled
    ) {
      setParticipants((prevParticipant) =>
        prevParticipant.map((item) => {
          if (item.participant.sid !== participant.participant.sid) {
            return item;
          }
          const {track, ...rest} = item;
          return rest;
        }),
      );
    }
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
          <FlatList
            data={participants}
            horizontal
            keyExtractor={(item) => item.participant.sid}
            removeClippedSubviews={false}
            renderItem={({item, index}) => (
              <View key={index} style={styles.participantItem}>
                {showTwilioVideoParticipantView(item?.track) ? (
                  <TwilioVideoParticipantView
                    key={item.participant.sid}
                    trackIdentifier={{
                      participantSid: item.participant.sid,
                      videoTrackSid: item.track.trackSid,
                    }}
                    style={styles.twilioVideoView}
                  />
                ) : (
                  <Icon
                    reverse
                    name="person"
                    color={theme.colors.primary}
                    size={18}
                  />
                )}
                <Text numberOfLines={1} style={styles.participantName}>
                  {getParticipantName(item.participant)}
                </Text>
              </View>
            )}
            style={styles.participantContainer}
          />
          {hasStartedCall && (
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
        onParticipantEnabledVideoTrack={_onParticipantEnabledVideoTrack}
        onParticipantDisabledVideoTrack={_onParticipantDisabledVideoTrack}
        onDataTrackMessageReceived={_onDataTrackMessageReceived}
      />
    </View>
  );
};

export default AcceptCall;
