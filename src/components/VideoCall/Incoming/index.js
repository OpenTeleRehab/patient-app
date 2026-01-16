/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useRef} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {Icon, Text} from 'react-native-elements';
import {TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CALL_STATUS} from '../../../variables/constants';
import {useCallContext} from '../../../context/CallContext';
import {updateMessage} from '../../../utils/rocketchat';
import RocketchatContext from '../../../context/RocketchatContext';
import {
  clearCallAccessToken,
  clearVideoCallStatus,
} from '../../../store/rocketchat/actions';
import styles from '../../../assets/styles';

const IncomingCall = ({
  translate,
  theme,
  isVideoOn,
  isSpeakerOn,
  isMute,
  onVideoOn,
  onSpeakerOn,
  onMute,
}) => {
  const callTimeout = useRef(null);
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const {handleAcceptCall} = useCallContext();
  const {handlePushNotification} = useCallContext();
  const chatSocket = useContext(RocketchatContext);
  const chatAuth = useSelector((state) => state.rocketchat.chatAuth);
  const videoCall = useSelector((state) => state.rocketchat.videoCall);
  const selectedRoom = useSelector((state) => state.rocketchat.selectedRoom);
  const profile = useSelector((state) => state.user.profile);

  const isLocalParticipant = videoCall.u._id === chatAuth.userId;

  useEffect(() => {
    callTimeout.current = setTimeout(() => {
      if (chatAuth.userId === videoCall.u._id) {
        const _id = videoCall._id;
        const rid = videoCall.rid;
        const msg =
          videoCall.status === CALL_STATUS.AUDIO_STARTED
            ? CALL_STATUS.AUDIO_MISSED
            : CALL_STATUS.VIDEO_MISSED;

        // Send missed call message
        updateMessage(chatSocket, {_id, rid, msg}, profile.id);

        if (!netInfo.isConnected) {
          // Clear call access token
          dispatch(clearCallAccessToken());

          // Cleanup video call
          dispatch(clearVideoCallStatus());
        }
      }

      // Cleanup video call
      dispatch(clearVideoCallStatus());
    }, 60000); // milliseconds
    return () => {
      clearInterval(callTimeout.current);
    };
  }, [
    chatAuth,
    chatSocket,
    dispatch,
    handlePushNotification,
    netInfo.isConnected,
    profile,
    selectedRoom,
    videoCall,
  ]);

  const handleDeclineCall = () => {
    const _id = videoCall._id;
    const rid = videoCall.rid;
    const msg =
      videoCall.status === CALL_STATUS.AUDIO_STARTED
        ? CALL_STATUS.AUDIO_MISSED
        : CALL_STATUS.VIDEO_MISSED;

    // Send decline call message
    updateMessage(chatSocket, {_id, rid, msg}, profile.id);

    if (chatAuth.userId === videoCall.u._id) {
      handlePushNotification({
        _id,
        rid,
        identity: selectedRoom.u.username,
        title: profile.first_name + ' ' + profile.last_name,
        body: msg,
      });
    }

    if (!netInfo.isConnected) {
      // Clear call access token
      dispatch(clearCallAccessToken());

      // Cleanup video call
      dispatch(clearVideoCallStatus());
    }
  };

  return (
    <>
      <View style={styles.incomingCallContainer}>
        <View style={[styles.flexCenter, styles.justifyContentCenter]}>
          <Text style={styles.callerName}>
            {isLocalParticipant ? selectedRoom.name : videoCall.u.name}
          </Text>
          <Text style={styles.callingText}>
            {translate('video_call_starting')}
          </Text>
        </View>

        <View style={styles.flexCenter}>
          <View style={[styles.flexRow, styles.flexCenter]}>
            <TouchableOpacity
              style={[styles.flexCenter, styles.btnCallOption]}
              onPress={onVideoOn}>
              <Icon
                reverse
                type="feather"
                name={isVideoOn ? 'video' : 'video-off'}
                color={isVideoOn ? theme.colors.dark : theme.colors.grey2}
                size={24}
              />
              <Text>{translate(isVideoOn ? 'video_on' : 'video_off')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSpeakerOn}
              style={[styles.flexCenter, styles.btnCallOption]}>
              <Icon
                reverse
                type="feather"
                name={isSpeakerOn ? 'volume-2' : 'volume-x'}
                color={isSpeakerOn ? theme.colors.dark : theme.colors.grey2}
                size={24}
              />
              <Text>
                {translate(isSpeakerOn ? 'speaker_on' : 'speaker_off')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onMute}
              style={[styles.flexCenter, styles.btnCallOption]}>
              <Icon
                reverse
                type="feather"
                name={isMute ? 'mic-off' : 'mic'}
                color={isMute ? theme.colors.grey2 : theme.colors.dark}
                size={24}
              />
              <Text>{translate(isMute ? 'mute' : 'unmute')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.flexCenter,
            styles.flexRow,
            styles.justifyContentCenter,
          ]}>
          <View style={[styles.flexRow]}>
            <TouchableOpacity
              style={[styles.btnCallAction, styles.flexCenter]}
              onPress={handleDeclineCall}>
              <Icon
                reverse
                type="material-icons"
                name="call-end"
                color={theme.colors.danger}
                size={38}
              />
              <Text style={[styles.callActionLabel, styles.textDanger]}>
                {translate(isLocalParticipant ? 'end_call' : 'decline_call')}
              </Text>
            </TouchableOpacity>
            {!isLocalParticipant && (
              <TouchableOpacity
                onPress={handleAcceptCall}
                style={[styles.btnCallAction, styles.flexCenter]}>
                <Icon
                  reverse
                  type="material-icons"
                  name="call"
                  color={theme.colors.primary}
                  size={38}
                />
                <Text style={[styles.callActionLabel, styles.textPrimary]}>
                  {translate('accept_call')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default IncomingCall;
