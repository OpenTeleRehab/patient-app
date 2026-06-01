import React from 'react';
import {useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Icon, Text, withTheme} from 'react-native-elements';
import {TwilioVideoLocalView} from 'react-native-twilio-video-webrtc';
import styles from '../../../assets/styles';

const LocalParticipant = ({
  theme,
  isVideoEnabled,
  participants,
  showAutoEndCallHint,
}) => {
  const insets = useSafeAreaInsets();
  const {height: screenHeight} = useWindowDimensions();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {isChatConnected} = useSelector((state) => state.indicator);
  const {profile} = useSelector((state) => state.user);

  const videoContainerH =
    participants.length === 0
      ? {height: '100%'}
      : {height: screenHeight - 320 - insets.top - insets.bottom};

  return (
    <View style={{...styles.localVideoContainer, ...videoContainerH}}>
      {!isChatConnected && (
        <Text style={styles.callMessage}>
          {translate('call_message.trying_to_reconnect')}
        </Text>
      )}
      {showAutoEndCallHint && (
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
        </>
      )}
    </View>
  );
};

export default withTheme(LocalParticipant);
