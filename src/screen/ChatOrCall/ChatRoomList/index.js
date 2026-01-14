/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ListItem, Badge} from 'react-native-elements';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {renderMsgText} from '../../../utils/helper';
import {CHAT_USER_STATUS, ROUTES} from '../../../variables/constants';
import {mutation} from '../../../store/rocketchat/mutations';
import {getProfessionRequest} from '../../../store/profession/actions';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {
  getPatientChatRooms,
  getPhcChatRooms,
  getTherapistChatRooms,
} from '../../../utils/chat';

const ChatRoomList = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {professions} = useSelector((state) => state.profession);
  const [defaultExpanded, setDefaultExpanded] = useState([
    'patients',
    'therapists',
    'phc_workers',
  ]);

  const rooms = {
    patients: getPatientChatRooms(),
    therapists: getTherapistChatRooms(),
    phc_workers: getPhcChatRooms(),
  };

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
    dispatch(mutation.getMessagesInRoomSuccess(item.messages));

    navigation.navigate(ROUTES.CHAT_PANEL);
  };

  const getProfession = (id) => {
    const profession = professions.find((item) => item.id === id);

    return profession ? ' - ' + profession.name : '';
  };

  return (
    <>
      <HeaderBar leftContent={{label: translate('tab.messages')}} />
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
                    {rooms[key].map((item, i) => (
                      <ListItem
                        key={i}
                        bottomDivider
                        containerStyle={componentStyles.listItemContainerStyle}
                        onPress={() => handleSelectRoom(item)}>
                        <ListItem.Content>
                          <ListItem.Title>
                            {item.name}
                            {getProfession(item.professionId)}{' '}
                            <Badge
                              badgeStyle={
                                item.u.status === CHAT_USER_STATUS.ONLINE
                                  ? styles.bgSuccess
                                  : styles.bgGrey
                              }
                            />
                          </ListItem.Title>
                          <ListItem.Subtitle>
                            {renderMsgText(item.lastMessage, translate)}
                          </ListItem.Subtitle>
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
