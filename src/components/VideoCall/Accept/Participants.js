import React from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, View} from 'react-native';
import {Icon, Text, withTheme} from 'react-native-elements';
import {TwilioVideoParticipantView} from 'react-native-twilio-video-webrtc';
import styles from '../../../assets/styles';

const Participants = ({theme, participants}) => {
  const {chatRooms} = useSelector(
    (state) => state.rocketchat,
  );

  const findParticipantName = (identity) => {
    const chatRoom = chatRooms.find((item) =>
      identity.startsWith(item.u.username),
    );
    return chatRoom?.name ?? '';
  };

  return (
    <ScrollView horizontal style={styles.participantContainer}>
      {participants.length > 0 &&
        Array.from(participants, ({participant, track}) => (
          <View key={participant.identity} style={styles.participantItem}>
            {track ? (
              <TwilioVideoParticipantView
                trackIdentifier={{
                  participantSid: participant.sid,
                  videoTrackSid: track.trackSid,
                }}
                style={styles.twilioVideoView}
              />
            ) : (
              <>
                <Icon
                  reverse
                  name="person"
                  color={theme.colors.primary}
                  size={18}
                />
              </>
            )}
            <Text style={styles.participantName}>
              {findParticipantName(participant.identity)}
            </Text>
          </View>
        ))}
    </ScrollView>
  );
};

export default withTheme(Participants);
