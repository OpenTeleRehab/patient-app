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

const ChatContainer = ({
  chatData,
  onShowMediaSlider,
  onCurrentAttachment,
  isVideoAttachment,
  theme,
  translate,
}) => {
  return (
    <>
      <Message
        {...chatData}
        renderBubble={() => (
          <Bubble
            {...chatData}
            timeTextStyle={{
              left: styles.fontBase,
              right: styles.fontBase,
            }}
            wrapperStyle={{
              left: styles.chatBubbleLeft,
              right: styles.chatBubbleRight,
            }}
            renderMessageText={() => (
              <ChatTypeText chatData={chatData} translate={translate} />
            )}
            renderMessageImage={() => (
              <ChatTypeImage
                chatData={chatData}
                onShowMediaSlider={onShowMediaSlider}
                onCurrentAttachment={onCurrentAttachment}
                isVideoAttachment={isVideoAttachment}
                theme={theme}
              />
            )}
            renderMessageVideo={() => (
              <ChatTypeVideo
                chatData={chatData}
                onShowMediaSlider={onShowMediaSlider}
                onCurrentAttachment={onCurrentAttachment}
                isVideoAttachment={isVideoAttachment}
              />
            )}
          />
        )}
        renderDay={() => (
          <Day
            {...chatData}
            textStyle={[styles.chatDay, styles.fontBase]}
            dateFormat={settings.format.date}
          />
        )}
        renderAvatar={null}
      />
    </>
  );
};

export default ChatContainer;
