/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {ListItem, Badge, Icon} from 'react-native-elements';
import {useNetInfo} from '@react-native-community/netinfo';
import {useIsFocused} from '@react-navigation/native';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {CHAT_USER_STATUS, ROUTES} from '../../../variables/constants';
import {mutation} from '../../../store/rocketchat/mutations';
import {getProfessionRequest} from '../../../store/profession/actions';
import {reconnectChatSocket} from '../../../utils/rocketchat';
import HeaderBar from '../../../components/Common/HeaderBar';
import LastMessagePreview from '../_Partials/LastMessagePreview';
import ChatServerDown from '../_Partials/ChatServerDown';
import {getPatientChatRooms, getPhcChatRooms, getTherapistChatRooms} from '../../../utils/chat';
import styles from '../../../assets/styles';

const ChatRoomList = ({navigation}) => {
  const dispatch = useDispatch();
  const isOnline = useNetInfo().isConnected;
  const isFocused = useIsFocused();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile, isDataUpToDate} = useSelector((state) => state.user);
  const {chatAuth, isLoading} = useSelector((state) => state.rocketchat);
  const {professions} = useSelector((state) => state.profession);
  const {isChatServerDown, isChatConnected} = useSelector((state) => state.indicator);
  const [defaultExpanded, setDefaultExpanded] = useState([
    'patients',
    'therapists',
    'phc_workers',
  ]);
  const isWaitingForChatLogin = isOnline && (!isChatConnected || profile?.chat_user_id !== chatAuth?.userId);
  const isWaitingForReLogin = isOnline && isDataUpToDate === false;
  const shouldShowLoading = isLoading || isWaitingForChatLogin || isWaitingForReLogin;
  const [isLoadingLingering, setIsLoadingLingering] = useState(shouldShowLoading);
  const showLoading = shouldShowLoading || isLoadingLingering;

  // Set from the socket/login outcome, not from a missing chatAuth: chatAuth is also missing during every normal connect.
  const showServerDown = isOnline && isChatServerDown;

  const rooms = {
    patients: getPatientChatRooms(),
    therapists: getTherapistChatRooms(),
    phc_workers: getPhcChatRooms(),
  };

  useEffect(() => {
    if (shouldShowLoading) {
      setIsLoadingLingering(true);
      return undefined;
    }

    const timeout = setTimeout(() => setIsLoadingLingering(false), 150);
    return () => clearTimeout(timeout);
  }, [shouldShowLoading]);

  useEffect(() => {
    dispatch(getProfessionRequest());
  }, [dispatch]);

  const handleToggleRoom = (key) => {
    if (defaultExpanded.includes(key)) {
      setDefaultExpanded(defaultExpanded.filter((k) => k !== key));
    } else {
      setDefaultExpanded([...defaultExpanded, key]);
    }
  };

  const handleSelectRoom = (item) => {
    dispatch(mutation.selectRoomSuccess(item));
    navigation.navigate(ROUTES.CHAT_PANEL);
  };

  const getProfession = (id) => {
    const profession = professions.find((item) => item.id === id);

    return profession ? ' - ' + profession.name : '';
  };

  return (
    <>
      <HeaderBar leftContent={{label: translate('tab.messages')}} />

      {showServerDown ? (
        <ChatServerDown translate={translate} onRetry={() => reconnectChatSocket({force: true})} />
      ) : (
        <ScrollView>
          {Object.keys(rooms).map((key) => (
            <View key={key}>
              {rooms[key].length > 0 && (
                <View style={componentStyles.listItemWrapper}>
                  <ListItem
                    bottomDivider
                    containerStyle={componentStyles.listItemContainerStyle}
                    onPress={() => handleToggleRoom(key)}>
                    <ListItem.Content>
                      <ListItem.Title style={styles.textPrimary}>
                        {translate(`common.${key}`)}
                      </ListItem.Title>
                    </ListItem.Content>
                    <Icon
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
                      {rooms[key].map((item, i) => (
                        <ListItem
                          key={i}
                          bottomDivider
                          containerStyle={
                            componentStyles.listItemContainerStyle
                          }
                          onPress={() => handleSelectRoom(item)}>
                          <ListItem.Content>
                            <ListItem.Title>
                              {item.name}
                              {getProfession(item.professionId)}{' '}
                              <Badge
                                badgeStyle={
                                  isOnline && item.u.status === CHAT_USER_STATUS.ONLINE
                                    ? styles.bgSuccess
                                    : styles.bgGrey
                                }
                              />
                            </ListItem.Title>
                            <LastMessagePreview lastMessage={item.lastMessage} translate={translate} />
                          </ListItem.Content>
                          {item.unreads > 0 && (
                            <Badge
                              value={item.unreads > 99 ? '99+' : item.unreads}
                              status="error"
                            />
                          )}
                        </ListItem>
                      ))}
                    </>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      <Spinner
        visible={showLoading && !showServerDown && isFocused}
        overlayColor="rgba(0, 0, 0, 0.5)"
        textStyle={styles.textLight}
      />
    </>
  );
};

const componentStyles = StyleSheet.create({
  listItemWrapper: {
    marginBottom: 4,
  },
  listItemContainerStyle: {
    paddingHorizontal: 12,
  },
});

export default ChatRoomList;
