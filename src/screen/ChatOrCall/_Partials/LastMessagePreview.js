/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import variables from '../../../assets/styles/variables';
import styles from '../../../assets/styles';

const LastMessagePreview = ({lastMessage, translate}) => {
  if (!lastMessage) {
    return null;
  }

  const msg = lastMessage.msg || lastMessage.text;
  // A queued attachment only has the local image/video uri; server messages carry `file`.
  const isVideo = !!lastMessage.video || lastMessage.file?.type?.startsWith('video/');
  const isAttachment = !!(lastMessage.file || lastMessage.image || lastMessage.video);
  // Queued while offline (or waiting on the socket); cleared when the server echoes the message back.
  const isPending = !!lastMessage.pending;

  let content = null;
  let contentStyle;
  let contentIcon;

  if (msg?.startsWith('jitsi_call')) {
    content = translate(msg);
    contentStyle = msg.endsWith('_missed') || msg.endsWith('_busy') ? styles.textDanger : undefined;
  } else if (msg) {
    content = msg;
  } else if (isAttachment) {
    content = translate('chat_attachment.title');
    contentStyle = styles.textPrimary;
    contentIcon = isVideo ? 'videocam' : 'photo';
  }

  return (
    <View style={componentStyles.row}>
      {isPending && (
        <>
          <Icon
            name="schedule"
            size={14}
            color={variables.orangeDark2}
            style={componentStyles.icon}
          />
          <Text style={componentStyles.sendingText}>
            {translate('chat_message.sending')}
          </Text>
          {content !== null && <Text style={componentStyles.separator}>·</Text>}
        </>
      )}
      {contentIcon && (
        <Icon
          name={contentIcon}
          size={14}
          color={isPending ? variables.grey2 : variables.primary}
          style={componentStyles.icon}
        />
      )}
      {content !== null && (
        <Text
          numberOfLines={1}
          style={[
            componentStyles.contentText,
            contentStyle,
            isPending && componentStyles.pendingContentText,
          ]}>
          {content}
        </Text>
      )}
    </View>
  );
};

const componentStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  icon: {
    marginRight: 4,
  },
  sendingText: {
    color: variables.orangeDark2,
    fontSize: variables.fontSizeSm,
    fontWeight: variables.fontWeightMedium,
  },
  separator: {
    color: variables.grey3,
    fontSize: variables.fontSizeSm,
    marginHorizontal: 6,
  },
  contentText: {
    flexShrink: 1,
    color: variables.grey1,
    fontSize: variables.fontSizeSm,
  },
  pendingContentText: {
    color: variables.grey2,
  },
});

export default LastMessagePreview;
