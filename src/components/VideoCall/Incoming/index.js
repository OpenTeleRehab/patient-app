/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Icon, Text} from 'react-native-elements';
import {TouchableOpacity, View} from 'react-native';
import styles from '../../../assets/styles';
import {useSelector} from 'react-redux';
import {CALL_STATUS} from '../../../variables/constants';

const IncomingCall = ({
  onAcceptCall,
  onDeclineCall,
  onVideoOn,
  onSpeakerOn,
  onMute,
  translate,
  theme,
  callName,
}) => {
  const {videoCall} = useSelector((state) => state.rocketchat);

  const [isVideoOn, setIsVideoOn] = useState(
    videoCall.status === CALL_STATUS.VIDEO_STARTED,
  );
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMute, setIsMute] = useState(false);

  useEffect(() => {
    onVideoOn(videoCall.status === CALL_STATUS.VIDEO_STARTED);
  }, [onVideoOn, videoCall]);

  const handleVideoOnOff = () => {
    setIsVideoOn(!isVideoOn);
    onVideoOn(!isVideoOn);
  };
  const handleSpeakerOnOff = () => {
    setIsSpeakerOn(!isSpeakerOn);
    onSpeakerOn(!isSpeakerOn);
  };
  const handleMuteOrUnmute = () => {
    setIsMute(!isMute);
    onMute(!isMute);
  };

  return (
    <>
      <View style={[styles.callContainer, styles.flexColumn]}>
        <View style={[styles.flexCenter, styles.justifyContentCenter]}>
          <Text style={styles.callerName}>{callName}</Text>
          <Text style={styles.callingText}>
            {translate('video_call_starting')}
          </Text>
        </View>

        <View style={styles.flexCenter}>
          <View style={[styles.flexRow, styles.flexCenter]}>
            <TouchableOpacity
              style={[styles.flexCenter, styles.btnCallOption]}
              onPress={() => handleVideoOnOff()}>
              <Icon
                type="feather"
                name={isVideoOn ? 'video' : 'video-off'}
                color={theme.colors.white}
                size={22}
                style={[styles.callOptionIcon, isVideoOn ? styles.bgDark : '']}
              />
              <Text>{translate(isVideoOn ? 'video_on' : 'video_off')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flexCenter, styles.btnCallOption]}
              onPress={() => handleSpeakerOnOff()}>
              <Icon
                type="feather"
                name={isSpeakerOn ? 'volume-2' : 'volume-x'}
                color={theme.colors.white}
                size={22}
                style={[
                  styles.callOptionIcon,
                  isSpeakerOn ? styles.bgDark : '',
                ]}
              />
              <Text>
                {translate(isSpeakerOn ? 'speaker_on' : 'speaker_off')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flexCenter, styles.btnCallOption]}
              onPress={() => handleMuteOrUnmute()}>
              <Icon
                type="feather"
                name={isMute ? 'mic-off' : 'mic'}
                color={theme.colors.white}
                size={22}
                style={[styles.callOptionIcon, isMute ? '' : styles.bgDark]}
              />
              <Text>{translate(isMute ? 'unmute' : 'mute')}</Text>
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
              onPress={() => onDeclineCall()}>
              <Icon
                type="material-icons"
                name="call-end"
                color={theme.colors.white}
                size={32}
                style={[styles.callActionIcon, styles.bgDanger]}
              />
              <Text style={[styles.callActionLabel, styles.textDanger]}>
                {translate('decline_call')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnCallAction, styles.flexCenter]}
              onPress={() => onAcceptCall()}>
              <Icon
                type="material-icons"
                name="call"
                color={theme.colors.white}
                size={32}
                style={[styles.callActionIcon, styles.bgPrimary]}
              />
              <Text style={[styles.callActionLabel, styles.textPrimary]}>
                {translate('accept_call')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default IncomingCall;
