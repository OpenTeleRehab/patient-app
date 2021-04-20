/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Bubble, Day, Message} from 'react-native-gifted-chat';
import ChatTypeText from './ChatTypeText';
import ChatTypeImage from './ChatTypeImage';
import ChatTypeVideo from './ChatTypeVideo';
import styles from '../../../assets/styles';
import settings from '../../../../config/settings';

const ChatContainer = ({chatData, theme, translate}) => {
  return (
    <Message
      {...chatData}
      renderBubble={() => (
        <Bubble
          {...chatData}
          wrapperStyle={{
            left: styles.chatBubbleLeft,
            right: styles.chatBubbleRight,
          }}
          renderMessageText={() => (
            <ChatTypeText chatData={chatData} translate={translate} />
          )}
          renderMessageImage={() => (
            <ChatTypeImage chatData={chatData} theme={theme} />
          )}
          renderMessageVideo={() => <ChatTypeVideo chatData={chatData} />}
        />
      )}
      renderDay={() => (
        <Day
          {...chatData}
          textStyle={styles.chatDay}
          dateFormat={settings.format.date}
        />
      )}
      renderAvatar={null}
    />
  );
};

export default ChatContainer;
