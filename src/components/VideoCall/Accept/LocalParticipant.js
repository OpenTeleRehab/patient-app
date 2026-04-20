import React, {useContext, useEffect, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Icon, Text, withTheme} from 'react-native-elements';
import {TwilioVideoLocalView} from 'react-native-twilio-video-webrtc';
import {formatCallDuration} from '../../../utils/chat';
import {CALL_STATUS} from '../../../variables/constants';
import RocketchatContext from '../../../context/RocketchatContext';
import styles from '../../../assets/styles';
import {updateTextMessage} from '../../../store/rocketchat/actions';

const LocalParticipant = ({
  theme,
  isVideoEnabled,
  callDuration,
  participants,
}) => {
  const dispatch = useDispatch();
  const chatSocket = useContext(RocketchatContext);
  const insets = useSafeAreaInsets();
  const {height: screenHeight} = useWindowDimensions();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {isChatConnected} = useSelector((state) => state.indicator);
  const {profile} = useSelector((state) => state.user);
  const {hasAcceptedCall, videoCall} = useSelector((state) => state.rocketchat);
  const [isJoinedAlone, setIsJoinedAlone] = useState(false);

  const videoContainerH =
    participants.length === 0
      ? {height: '100%'}
      : {height: screenHeight - 320 - insets.top - insets.bottom};

  useEffect(() => {
    if (hasAcceptedCall && participants.length === 0) {
      if (callDuration === 30) {
        setIsJoinedAlone(true);
      }

      if (callDuration === 60) {
        const message = {
          _id: videoCall._id,
          rid: videoCall.rid,
          user: {
            _id: videoCall.u._id,
            username: videoCall.u.username,
          },
          text: isVideoEnabled
            ? CALL_STATUS.VIDEO_ENDED
            : CALL_STATUS.AUDIO_ENDED,
        };

        dispatch(updateTextMessage(chatSocket, message, false));
      }
    }
  }, [
    callDuration,
    chatSocket,
    dispatch,
    hasAcceptedCall,
    isVideoEnabled,
    participants,
    videoCall,
  ]);

  return (
    <View style={{...styles.localVideoContainer, ...videoContainerH}}>
      {!isChatConnected && (
        <Text style={styles.callMessage}>
          {translate('call_message.trying_to_reconnect')}
        </Text>
      )}
      {isJoinedAlone && (
        <Text style={styles.callMessage}>
          {translate('chat_message.no_participants_auto_end_call')}
        </Text>
      )}
      {isVideoEnabled ? (
        <TwilioVideoLocalView
          enabled
          applyZOrder
          style={styles.twilioVideoView}
        />
      ) : (
        <>
          <Icon reverse name="person" color={theme.colors.primary} />
          <Text style={styles.textLight}>
            {profile.last_name} {profile.first_name}
          </Text>
          <Text style={styles.textLight}>
            {formatCallDuration(callDuration)}
          </Text>
        </>
      )}
    </View>
  );
};

export default withTheme(LocalParticipant);
