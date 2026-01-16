/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Badge, BottomSheet, Icon, ListItem, Text} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {useCallContext} from '../../../context/CallContext';
import {
  getPatientChatRooms,
  getPhcChatRooms,
  getTherapistChatRooms,
} from '../../../utils/chat';
import {generateHash} from '../../../utils/helper';
import {CALL_STATUS, CHAT_USER_STATUS} from '../../../variables/constants';
import {sendNewMessage} from '../../../utils/rocketchat';
import RocketchatContext from '../../../context/RocketchatContext';
import {theme} from '../../../../App';
import styles from '../../../assets/styles';

const ParticipantInvitation = ({
  isVideoOn,
  participants,
  onSetInvitingParticipants,
}) => {
  const chatSocket = useContext(RocketchatContext);
  const {handlePushNotification} = useCallContext();
  const {handleDeclineCall} = useCallContext();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile} = useSelector((state) => state.user);
  const {chatRooms} = useSelector((state) => state.rocketchat);
  const [isVisible, setIsVisible] = useState(false);
  const [defaultExpanded, setDefaultExpanded] = useState([
    'patients',
    'therapists',
    'phc_workers',
  ]);

  const [invitingParticipants, setInvitingParticipants] = useState([]);

  const groupChatRooms = {
    patients: getPatientChatRooms(),
    therapists: getTherapistChatRooms(),
    phc_workers: getPhcChatRooms(),
  };

  useEffect(() => {
    if (chatRooms?.length > 0) {
      setInvitingParticipants(
        chatRooms.map((chatRoom) => ({
          rid: chatRoom.rid,
          u: chatRoom.u,
        })),
      );
    }
  }, [chatRooms]);

  useEffect(() => {
    onSetInvitingParticipants(
      invitingParticipants.filter((item) => item?.countdown > 0),
    );
  }, [invitingParticipants, onSetInvitingParticipants]);

  useEffect(() => {
    const timers = invitingParticipants.map((participant) => {
      if (participant.countdown === undefined) {
        return null;
      } else {
        if (participant.countdown > 0) {
          return setTimeout(() => {
            setInvitingParticipants((prev) =>
              prev.map((p) => {
                if (p.countdown === undefined) {
                  return p;
                } else {
                  const countryId = profile.country_id;
                  const username = p.u.username;
                  const identity = username + '_' + countryId;

                  const joined = participants.find(
                    (item) => item.identity === identity,
                  );

                  if (joined) {
                    return {...p, countdown: undefined};
                  } else {
                    return {...p, countdown: p.countdown - 1};
                  }
                }
              }),
            );
          }, 1000);
        }

        if (participant.countdown === 0) {
          const _id = participant._id;
          const rid = participant.rid;
          const msg = CALL_STATUS.AUDIO_MISSED;

          handleDeclineCall(_id, rid, msg);

          return null;
        }
      }
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [
    handleDeclineCall,
    invitingParticipants,
    participants,
    profile.country_id,
  ]);

  const getInvitationCountdown = (rid) => {
    return invitingParticipants.find((item) => item.rid === rid)?.countdown;
  };

  const checkParticipantJoined = (room) => {
    return participants.some(
      ({participant}) =>
        participant.identity === room.u.username + '_' + profile.country_id,
    );
  };

  const handleToggleRoom = (key) => {
    if (defaultExpanded.includes(key)) {
      setDefaultExpanded(defaultExpanded.filter((k) => k !== key));
    } else {
      setDefaultExpanded([...defaultExpanded, key]);
    }
  };

  const handleInviteParticipant = (participant) => {
    const _id = generateHash();
    const rid = participant.rid;
    const text = isVideoOn
      ? CALL_STATUS.VIDEO_STARTED
      : CALL_STATUS.AUDIO_STARTED;

    setInvitingParticipants((prev) =>
      prev.map((item) =>
        item.u._id === participant.u._id
          ? {...item, _id: _id, countdown: 60}
          : item,
      ),
    );

    // Send call message
    sendNewMessage(chatSocket, {_id, rid, text}, profile.id);

    // Send podcast notification
    if (participant.u.status === CHAT_USER_STATUS.OFFLINE) {
      const notification = {
        _id,
        rid,
        identity: participant.u.username,
        title: profile.first_name + ' ' + profile.last_name,
        body: text,
      };
      handlePushNotification(notification);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.btnAddParticipant}
        onPress={() => setIsVisible(true)}>
        <Icon name="person-add-alt-1" color={theme.colors.white} size={26} />
      </TouchableOpacity>
      <BottomSheet isVisible={isVisible} modalProps={{}}>
        <View style={styles.mainContainerLight}>
          <View style={componentStyles.bottomSheetHeader}>
            <Text
              accessible
              accessibilityLabel={translate('common.add_participants')}
              style={componentStyles.titleTextStyle}>
              {translate('common.add_participants')}
            </Text>
            <Icon name="close" onPress={() => setIsVisible(false)} />
          </View>
          {Object.keys(groupChatRooms).map((key) => (
            <View key={key}>
              {groupChatRooms[key].length > 0 && (
                <>
                  <ListItem
                    bottomDivider
                    containerStyle={componentStyles.listItemContainerStyle}
                    onPress={() => handleToggleRoom(key)}>
                    <ListItem.Content>
                      <ListItem.Title style={styles.textPrimary}>
                        {translate(`common.${key}`)}
                      </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron
                      name={
                        defaultExpanded.includes(key)
                          ? 'keyboard-arrow-up'
                          : 'keyboard-arrow-down'
                      }
                      size={20}
                    />
                  </ListItem>
                  {defaultExpanded.includes(key) && (
                    <>
                      {groupChatRooms[key].map((room, i) => (
                        <ListItem
                          key={i}
                          bottomDivider
                          containerStyle={
                            componentStyles.listItemContainerStyle
                          }>
                          <ListItem.Content>
                            <View style={componentStyles.listItemTitleWrapper}>
                              <Badge
                                status={
                                  room.u.status === CHAT_USER_STATUS.ONLINE
                                    ? 'success'
                                    : 'grey'
                                }
                              />
                              <ListItem.Title>{room.name}</ListItem.Title>
                            </View>
                          </ListItem.Content>

                          {checkParticipantJoined(room) ? (
                            <TouchableOpacity
                              disabled
                              accessible
                              accessibilityLabel={translate('joined_call')}
                              style={styles.btnInviteParticipant}>
                              <Icon
                                name="phone-in-talk"
                                size={14}
                                color={theme.colors.grey4}
                              />
                              <Text
                                accessible
                                accessibilityLabel={translate('joined_call')}
                                style={styles.textLightGrey}>
                                {translate('joined_call')}
                              </Text>
                            </TouchableOpacity>
                          ) : getInvitationCountdown(room.rid) > 0 ? (
                            <TouchableOpacity
                              disabled
                              accessible
                              accessibilityLabel={translate('inviting_call')}
                              style={styles.btnInviteParticipant}>
                              <Icon
                                name="phone-in-talk"
                                size={14}
                                color={theme.colors.grey4}
                              />
                              <Text
                                accessible
                                accessibilityLabel={translate('inviting_call')}
                                style={styles.textLightGrey}>
                                {translate('inviting_call')}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              accessible
                              accessibilityLabel={translate('invite_call')}
                              onPress={() => handleInviteParticipant(room)}
                              style={styles.btnInviteParticipant}>
                              <Icon
                                name="call"
                                size={14}
                                color={theme.colors.white}
                              />
                              <Text
                                accessible
                                accessibilityLabel={translate('invite_call')}
                                style={styles.textLight}>
                                {translate('invite_call')}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </ListItem>
                      ))}
                    </>
                  )}
                </>
              )}
            </View>
          ))}
        </View>
      </BottomSheet>
    </>
  );
};

const componentStyles = StyleSheet.create({
  bottomSheetHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderStyle: 'solid',
  },
  titleTextStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemContainerStyle: {
    paddingHorizontal: 0,
    justifyContent: 'space-between',
  },
  listItemTitleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
});

export default ParticipantInvitation;
