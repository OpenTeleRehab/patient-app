import React from 'react';
import {Dimensions, View} from 'react-native';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Icon, Text, withTheme} from 'react-native-elements';
import {TwilioVideoLocalView} from 'react-native-twilio-video-webrtc';
import {formatCallDuration} from '../../../utils/chat';
import styles from '../../../assets/styles';

const LocalParticipant = ({
  theme,
  isVideoEnabled,
  callDuration,
  participants,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {isChatConnected} = useSelector((state) => state.indicator);
  const {profile} = useSelector((state) => state.user);

  const videoContainerH =
    participants.length === 0
      ? {height: '100%'}
      : {height: Dimensions.get('window').height - 290};

  return (
    <View style={{...styles.localVideoContainer, ...videoContainerH}}>
      {!isChatConnected && (
        <Text style={styles.callMessage}>
          {translate('call_message.trying_to_reconnect')}
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
            {profile.first_name} {profile.last_name}
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
