/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Icon, Text, withTheme} from 'react-native-elements';
import {Modal, TouchableOpacity, View} from 'react-native';
import styles from '../../../assets/styles';

const CallModal = ({theme}) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMute, setIsMute] = useState(false);

  const onVideoOn = () => setIsVideoOn(!isVideoOn);
  const onSpeakerOn = () => setIsSpeakerOn(!isSpeakerOn);
  const onMute = () => setIsMute(!isMute);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}>
        <View
          style={[
            styles.flexColumn,
            styles.justifyContentSpaceBetween,
            styles.callContainer,
          ]}>
          <View style={[styles.flexCenter, styles.justifyContentCenter]}>
            <Text style={styles.callerName}>Magaret Huge</Text>
            <Text style={styles.callingText}>calling...</Text>
          </View>
          <View style={styles.flexCenter}>
            <View style={[styles.flexRow, styles.flexCenter]}>
              <TouchableOpacity
                style={styles.btnCallOption}
                onPress={onVideoOn}>
                <Icon
                  type="feather"
                  name={isVideoOn ? 'video' : 'video-off'}
                  color={theme.colors.white}
                  size={22}
                  style={[
                    styles.callOptionIcon,
                    isVideoOn ? styles.callOptionIconActive : '',
                  ]}
                />
                {isVideoOn ? <Text>Video on</Text> : <Text>Video off</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCallOption}
                onPress={onSpeakerOn}>
                <Icon
                  type="feather"
                  name={isSpeakerOn ? 'volume-2' : 'volume-x'}
                  color={theme.colors.white}
                  size={22}
                  style={[
                    styles.callOptionIcon,
                    isSpeakerOn ? styles.callOptionIconActive : '',
                  ]}
                />
                {isSpeakerOn ? (
                  <Text>Speaker on</Text>
                ) : (
                  <Text>Speaker off</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnCallOption} onPress={onMute}>
                <Icon
                  type="feather"
                  name={isMute ? 'mic' : 'mic-off'}
                  color={theme.colors.white}
                  size={22}
                  style={[
                    styles.callOptionIcon,
                    isMute ? styles.callOptionIconActive : '',
                  ]}
                />
                {isMute ? <Text>Mute</Text> : <Text>Unmute</Text>}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.flexCenter}>
            <View style={[styles.flexRow, styles.flexCenter]}>
              <TouchableOpacity
                style={[styles.btnCallAction, styles.flexCenter]}
                onPress={() => setIsModalVisible(!isModalVisible)}>
                <Icon
                  type="material-icons"
                  name="call-end"
                  color={theme.colors.white}
                  size={32}
                  style={[styles.callActionIcon, styles.callDeclineIcon]}
                />
                <Text style={[styles.callActionLabel, styles.callDeclineText]}>
                  Decline
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnCallAction, styles.flexCenter]}>
                <Icon
                  type="material-icons"
                  name="call"
                  color={theme.colors.white}
                  size={32}
                  style={[styles.callActionIcon, styles.callAcceptIcon]}
                />
                <Text style={[styles.callActionLabel, styles.callAcceptText]}>
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default withTheme(CallModal);
