/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import {mutation} from '../../../store/rocketchat/mutations';

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
  const dispatch = useDispatch();
  const callTimeout = useRef(null);
  const netInfo = useNetInfo();
  const chatSocket = useContext(RocketchatContext);
  const {handleAcceptCall} = useCallContext();
  const {handlePushNotification} = useCallContext();
  const {
    videoCall,
    selectedRoom,
    hasStartedCall,
    chatRooms,
  } = useSelector((state) => state.rocketchat);
  const profile = useSelector((state) => state.user.profile);
  const [disabledAcceptCall, setDisabledAcceptCall] = useState(false);
  const [disabledDeclineCall, setDisabledDeclineCall] = useState(false);

  useEffect(() => {
    callTimeout.current = setTimeout(() => {
      if (hasStartedCall) {
        const _id = videoCall._id;
        const rid = videoCall.rid;
        const msg =
          videoCall.status === CALL_STATUS.AUDIO_STARTED
            ? CALL_STATUS.AUDIO_MISSED
            : CALL_STATUS.VIDEO_MISSED;

        // Send missed call message
        updateMessage(chatSocket, {_id, rid, msg}, profile.id);

        // Hide incoming call
        dispatch(mutation.showIncomingCall(false));

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
    chatSocket,
    dispatch,
    hasStartedCall,
    netInfo.isConnected,
    profile,
    videoCall,
  ]);

  const onAcceptCall = () => {
    setDisabledAcceptCall(true);
    handleAcceptCall();
  }

  const onDeclineCall = () => {
    setDisabledDeclineCall(true);

    const chatRoom = chatRooms.find((cr) => cr.rid === videoCall.rid);

    if (chatRoom) {
      const _id = videoCall._id;
      const rid = videoCall.rid;
      const msg = videoCall.status === CALL_STATUS.AUDIO_STARTED
          ? CALL_STATUS.AUDIO_MISSED
          : CALL_STATUS.VIDEO_MISSED;

      // Send decline call message
      updateMessage(chatSocket, {_id, rid, msg}, profile.id);

      if (chatRoom.u.status === 'offline') {
        handlePushNotification({
          _id,
          rid,
          identity: chatRoom.u.username,
          title: profile.first_name + ' ' + profile.last_name,
          body: msg,
        });
      }
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
            {hasStartedCall ? selectedRoom.name : videoCall.u.name}
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
              disabled={disabledDeclineCall}
              style={[styles.btnCallAction, styles.flexCenter]}
              onPress={onDeclineCall}>
              <Icon
                reverse
                type="material-icons"
                name="call-end"
                color={theme.colors.danger}
                size={38}
              />
              <Text style={[styles.callActionLabel, styles.textDanger]}>
                {translate(hasStartedCall ? 'end_call' : 'decline_call')}
              </Text>
            </TouchableOpacity>
            {!hasStartedCall && (
              <TouchableOpacity
                disabled={disabledAcceptCall}
                onPress={onAcceptCall}
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
