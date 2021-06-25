/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {ListItem, Badge} from 'react-native-elements';
import {ScrollView, View} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {renderMsgText} from '../../../utils/helper';
import {CHAT_USER_STATUS, ROUTES} from '../../../variables/constants';
import {selectRoom} from '../../../store/rocketchat/actions';
import {mutation} from '../../../store/rocketchat/mutations';
import styles from '../../../assets/styles';

const ChatRoomList = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {chatRooms} = useSelector((state) => state.rocketchat);
  const {isOnlineMode} = useSelector((state) => state.indicator);
  const {professions} = useSelector((state) => state.profession);

  const handleSelectRoom = (item) => {
    isOnlineMode
      ? dispatch(selectRoom(item))
      : dispatch(mutation.selectRoomSuccess(item));
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
        <View>
          {chatRooms.map((item, i) => (
            <ListItem
              key={i}
              bottomDivider
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
        </View>
      </ScrollView>
    </>
  );
};

export default ChatRoomList;
