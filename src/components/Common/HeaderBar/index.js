/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {Header, Text, Button, withTheme} from 'react-native-elements';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';
import {useSelector} from 'react-redux';
import {CALL_STATUS} from '../../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import NetInfo from '@react-native-community/netinfo';

let currentConnectionStatus = null;
NetInfo.fetch().then((state) => {
  currentConnectionStatus = state.isConnected;
});

const leftContainerMaxWidth = {maxWidth: '70%'};

const HeaderBar = (props) => {
  const {
    theme,
    title,
    onGoBack,
    leftContent,
    rightContent,
    backgroundPrimary,
  } = props;
  const {videoCall} = useSelector((state) => state.rocketchat);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [isOnline, setIsOnline] = useState(currentConnectionStatus);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });
    unsubscribe();
  });

  const renderLeftComponent = () => {
    if (onGoBack) {
      return (
        <Button
          title="Back"
          icon={{
            name: 'chevron-left',
            type: 'font-awesome-5',
            color: theme.colors.white,
          }}
          onPress={() => onGoBack()}
          type="clear"
          titleStyle={styles.headerTitle}
          buttonStyle={styles.headerBackButton}
        />
      );
    }
    if (leftContent) {
      const {hasLogo, label} = leftContent;
      if (hasLogo) {
        return <Image source={logoWhite} style={styles.headerLogo} />;
      }
      if (label) {
        return (
          <Text
            h4
            numberOfLines={1}
            style={backgroundPrimary ? styles.textLight : theme.colors.black}>
            {label}
          </Text>
        );
      }
      return leftContent;
    }
    return (
      <Text style={backgroundPrimary ? styles.textPrimary : styles.textLight}>
        Empty
      </Text>
    );
  };

  const renderCenterComponent = () => {
    if (title) {
      return (
        <Text
          style={[
            styles.headerTitle,
            {
              color: backgroundPrimary
                ? theme.colors.white
                : theme.colors.black,
            },
          ]}>
          {title}
        </Text>
      );
    }
  };

  const renderRightComponent = () => {
    if (rightContent) {
      const {icon, iconType, iconSize, label, onPress, disabled} = rightContent;
      return (
        <Button
          title={label}
          icon={
            icon
              ? {
                  name: icon,
                  type: iconType,
                  color: disabled
                    ? theme.colors.disabled
                    : backgroundPrimary
                    ? theme.colors.white
                    : theme.colors.primary,
                  size: iconSize || 15,
                }
              : null
          }
          type={label ? 'outline' : 'clear'}
          titleStyle={[
            backgroundPrimary ? styles.textLight : styles.textPrimary,
            styles.paddingX,
          ]}
          buttonStyle={styles.headerButton(label, backgroundPrimary)}
          onPress={onPress}
          disabled={disabled}
        />
      );
    }
    return (
      <Text style={backgroundPrimary ? styles.textPrimary : styles.textLight}>
        Empty
      </Text>
    );
  };

  return (
    <>
      {!isOnline && (
        <Text style={styles.offlineText}>{translate('common.offline')}</Text>
      )}
      <Header
        leftComponent={renderLeftComponent()}
        centerComponent={renderCenterComponent()}
        rightComponent={renderRightComponent()}
        leftContainerStyle={[styles.noneFlex, leftContainerMaxWidth]}
        centerContainerStyle={styles.textLight}
        rightContainerStyle={styles.noneFlex}
        containerStyle={[
          videoCall &&
          (videoCall.status === CALL_STATUS.AUDIO_ENDED ||
            videoCall.status === CALL_STATUS.VIDEO_ENDED)
            ? styles.headerWorkAround
            : styles.noneBorderBottom,
          !isOnline && styles.headerWorkAround,
          backgroundPrimary ? styles.backgroundPrimary : styles.backgroundWhite,
        ]}
      />
    </>
  );
};

export default withTheme(HeaderBar);
