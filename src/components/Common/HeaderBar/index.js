/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {Header, Text, Button, Icon, withTheme} from 'react-native-elements';
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
    setting,
    achievement,
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
          icon={<Icon type="feather" name="chevron-left" size={28} />}
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
    if (
      setting &&
      setting.hasSetting &&
      achievement &&
      achievement.hasAchievement
    ) {
      return (
        <View style={[styles.flexRow, styles.flexCenter]}>
          <Button
            title=""
            icon={
              <Icon
                type="simple-line-icon"
                name="badge"
                size={24}
                color={
                  backgroundPrimary ? theme.colors.white : theme.colors.primary
                }
              />
            }
            onPress={() => achievement.onGoAchievement()}
            type="clear"
            buttonStyle={styles.marginRight}
          />
          <Button
            title=""
            icon={
              <Icon
                type="simple-line-icon"
                name="settings"
                size={24}
                color={
                  backgroundPrimary ? theme.colors.white : theme.colors.primary
                }
              />
            }
            onPress={() => setting.onGoSetting()}
            type="clear"
            titleStyle={
              backgroundPrimary ? styles.textLight : styles.textPrimary
            }
            buttonStyle={styles.headerButton('', backgroundPrimary)}
          />
        </View>
      );
    }
    if (setting && setting.hasSetting) {
      return (
        <Button
          title=""
          icon={
            <Icon
              type="simple-line-icon"
              name="settings"
              size={24}
              color={
                backgroundPrimary ? theme.colors.white : theme.colors.primary
              }
            />
          }
          onPress={() => setting.onGoSetting()}
          type="clear"
          titleStyle={
            backgroundPrimary ? styles.textLight : styles.textPrimary
          }
          buttonStyle={styles.headerButton('', backgroundPrimary)}
        />
      );
    }
    if (achievement && achievement.hasAchievement) {
      return (
        <Button
          title=""
          icon={
            <Icon
              type="simple-line-icon"
              name="badge"
              size={24}
              color={
                backgroundPrimary ? theme.colors.white : theme.colors.primary
              }
            />
          }
          onPress={() => achievement.onGoAchievement()}
          type="clear"
          buttonStyle={styles.marginRight}
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
