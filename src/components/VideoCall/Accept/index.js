/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState, useRef, useContext} from 'react';
import RNCallKeep from 'react-native-callkeep';
import {
  AppState,
  NativeModules,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Icon, Text} from 'react-native-elements';
import {getLocalData} from '../../../utils/local_storage';
import {
  CALL_STATUS,
  STORAGE_KEY,
} from '../../../variables/constants';
import {
  clearCallAccessToken,
  clearVideoCallStatus,
} from '../../../store/rocketchat/actions';
import styles from '../../../assets/styles';
import CommonPopup from '../../Common/Popup';
import ParticipantInvitation from '../ParticipantInvitation';
import {sendNewMessage, updateMessage} from '../../../utils/rocketchat';
import {generateHash, isPhcWorker} from '../../../utils/helper';
import {useCallContext} from '../../../context/CallContext';
import RocketchatContext from '../../../context/RocketchatContext';
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
  const twilioRef = useRef(null);
  const dispatch = useDispatch();
  const {ForegroundService} = NativeModules;
  const {hostUserId} = useCallContext();
  const {participants} = useCallContext();
  const {handleSetParticipants} = useCallContext();
  const chatSocket = useContext(RocketchatContext);
  const {callAccessToken, chatAuth, chatRooms, videoCall} = useSelector(
    (state) => state.rocketchat,
  );
  const {isChatConnected} = useSelector((state) => state.indicator);
  const {profile} = useSelector((state) => state.user);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('connected');
  const [permissionSettingPopup, setPermissionSettingPopup] = useState(false);
  const [permissionMessagePopup, setPermissionMessagePopup] = useState('');
  const [forcePermissionMessagePopup, setForcePermissionMessagePopup] =
    useState(false);
  const [isConnecting, setIsConnecting] = useState(true); // Prevent duplicate connections.
  const [isTranscripting, setIsTranscripting] = useState(false);
  const [transcriptedText, setTranscriptedText] = useState('');

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

  const _onEndButtonPress = async () => {
    // Disconnect from twilio call
    twilioRef.current.disconnect();

    getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
      try {
        // End call keep
        callInfo.callUUID && RNCallKeep.endCall(callInfo.callUUID);

        // Stop foreground service
        ForegroundService.stopService();
      } catch {}
    });

    // Disconnect from twilio call
    twilioRef.current.disconnect();

    // Cleanup call access token
    dispatch(clearCallAccessToken());

    // Cleanup video call status
    dispatch(clearVideoCallStatus());

    if (videoCall.u._id === chatAuth.userId) {
      participants.forEach(({participant}) => {
        const room = chatRooms.find((chatRoom) =>
          participant.identity.startsWith(chatRoom.u.username),
        );

        const _id = generateHash();
        const rid = room.rid;
        const text = CALL_STATUS.AUDIO_ENDED;

        sendNewMessage(chatSocket, {_id, rid, text}, profile.id);
      });
    } else {
      const _id = videoCall._id;
      const rid = videoCall.rid;
      const msg = CALL_STATUS.AUDIO_ENDED;

      updateMessage(chatSocket, {_id, rid, msg}, profile.id);
    }
  };

  const _onRoomDidConnect = () => {
    getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
      try {
        callInfo.callUUID && RNCallKeep.endCall(callInfo.callUUID);
        ForegroundService.startService();
      } catch {}
    });
    setStatus('connected');
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

  const _onRoomDidDisconnect = (error) => {
    // TODO: Disconnect duplicate participant
    console.error(error);
  };

  const _onRoomDidFailToConnect = () => {
    setStatus('disconnected');
  };

  const _onRoomParticipantDidConnect = (participant) => {
    handleSetParticipants([...participants, participant]);
  };

  const _onRoomParticipantDidDisconnect = async (participant) => {
    const connectedParticipants = participants.filter(
      (item) => item.participant.identity !== participant.participant.identity,
    );

    if (connectedParticipants.length === 0) {
      // Disconnect from twilio call
      twilioRef.current.disconnect();

      // Stop foreground service
      getLocalData(STORAGE_KEY.CALL_INFO, true).then((callInfo) => {
        try {
          callInfo.callUUID && RNCallKeep.endCall(callInfo.callUUID);
          ForegroundService.stopService();
        } catch {}
      });

      // Cleanup call access token
      dispatch(clearCallAccessToken());

      // Cleanup video call status
      dispatch(clearVideoCallStatus());
    }

    handleSetParticipants(connectedParticipants);
  };

  const _onParticipantAddedVideoTrack = (participant) => {
    handleSetParticipants([
      ...participants.filter(
        (item) =>
          item.participant.identity !== participant.participant.identity,
      ),
      participant,
    ]);
  };

  const _onParticipantRemovedVideoTrack = (participant) => {
    participants.forEach(
      (item) =>
        item.participant.identity === participant.participant.identity &&
        delete item.track,
    );
    handleSetParticipants([...participants]);
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
          {hostUserId && (
            <ParticipantInvitation
              participants={participants}
              isVideoOn={isVideoOn}
            />
          )}

          <View style={styles.localVideoContainer}>
            {!isChatConnected && (
              <Text style={styles.callMessage}>
                {translate('call_message.trying_to_reconnect')}
              </Text>
            )}

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
            {/*{participants.length === 0 && (*/}
            {/*  <View style={styles.participantItem}>*/}
            {/*    <Icon*/}
            {/*      reverse*/}
            {/*      name="user-alt"*/}
            {/*      type="font-awesome-5"*/}
            {/*      color={theme.colors.black}*/}
            {/*    />*/}
            {/*  </View>*/}
            {/*)}*/}

            {participants.length > 0 &&
              Array.from(participants, ({participant, track}) => (
                <View key={participant.identity} style={styles.participantItem}>
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
                      containerStyle={{
                        backgroundColor: theme.colors.primary,
                      }}
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
              <Text style={styles.callTranscript}>{transcriptedText}</Text>
            </View>
          )}
          <View style={styles.callOptions}>
            <TouchableOpacity onPress={_onMuteButtonPress}>
              <Icon
                reverse
                type="feather"
                name={isAudioEnabled ? 'mic' : 'mic-off'}
                color={
                  isAudioEnabled ? theme.colors.bgDark : theme.colors.danger
                }
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
                color={
                  isVideoEnabled ? theme.colors.bgDark : theme.colors.danger
                }
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
                    isTranscripting ? theme.colors.bgDark : theme.colors.danger
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
