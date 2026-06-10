/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, Button, Icon, withTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import NetInfo from '@react-native-community/netinfo';
import logoWhite from '../../../assets/images/logo-white.png';
import variables from '../../../assets/styles/variables';
import styles from '../../../assets/styles';

let currentConnectionStatus = null;

NetInfo.fetch().then((state) => {
  currentConnectionStatus = state.isConnected;
});

const HeaderBar = (props) => {
  const {
    theme,
    title,
    onGoBack,
    leftContent,
    rightContent,
    setting,
    achievement,
    call,
  } = props;
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [isOnline, setIsOnline] = useState(currentConnectionStatus);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  const renderLeftComponent = () => {
    if (onGoBack) {
      return (
        <Button
          accessible={true}
          accessibilityLabel={translate('common.back')}
          title=""
          type="clear"
          icon={
            <Icon
              name="chevron-left"
              type="feather"
              color={theme.colors.white}
              size={28}
            />
          }
          titleStyle={styles.textLight}
          buttonStyle={componentStyles.headerBackButton}
          onPress={onGoBack}
        />
      );
    }
    if (leftContent) {
      const {hasLogo, label} = leftContent;
      if (hasLogo) {
        return <Image source={logoWhite} style={componentStyles.headerLogo} />;
      }
      if (label) {
        return (
          <Text
            accessible={true}
            accessibilityLabel={label}
            numberOfLines={1}
            style={styles.headerLeftTitleLight}>
            {label}
          </Text>
        );
      }
      return leftContent;
    }
    return null;
  };

  const renderCenterComponent = () => {
    if (title) {
      return (
        <Text
          accessible={true}
          accessibilityLabel={title}
          numberOfLines={1}
          style={styles.headerCenterTitleLight}>
          {title}
        </Text>
      );
    }
    return null;
  };

  const renderRightComponent = () => {
    if (rightContent) {
      const {icon, iconType, iconSize, label, onPress, disabled} = rightContent;
      return (
        <Button
          accessible={true}
          accessibilityLabel={label}
          title={<Text style={[styles.textInheritBold]}>{label}</Text>}
          icon={
            icon
              ? {
                  name: icon,
                  type: iconType,
                  color: disabled ? theme.colors.disabled : theme.colors.white,
                  size: iconSize || 15,
                }
              : null
          }
          type={label ? 'outline' : 'clear'}
          titleStyle={styles.textLight}
          buttonStyle={styles.headerButton(label, true)}
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
            accessible={true}
            accessibilityLabel={translate('common.go.to.achievement')}
            title=""
            icon={
              <Icon
                type="simple-line-icon"
                name="badge"
                size={24}
                color={theme.colors.white}
              />
            }
            onPress={() => achievement.onGoAchievement()}
            type="clear"
            buttonStyle={[styles.marginLeftLg, styles.noPadding]}
          />
          <Button
            accessible={true}
            accessibilityLabel={translate('common.go.to.settings')}
            title=""
            icon={
              <Icon
                type="simple-line-icon"
                name="settings"
                size={24}
                color={theme.colors.white}
              />
            }
            onPress={() => setting.onGoSetting()}
            type="clear"
            buttonStyle={[styles.marginLeftLg, styles.noPadding]}
          />
        </View>
      );
    }
    if (setting && setting.hasSetting) {
      return (
        <Button
          accessible={true}
          accessibilityLabel={translate('common.go.to.settings')}
          title=""
          icon={
            <Icon
              type="simple-line-icon"
              name="settings"
              size={24}
              color={theme.colors.white}
            />
          }
          onPress={() => setting.onGoSetting()}
          type="clear"
          buttonStyle={[styles.marginLeftLg, styles.noPadding]}
        />
      );
    }
    if (achievement && achievement.hasAchievement) {
      return (
        <Button
          accessible={true}
          accessibilityLabel={translate('common.go.to.achievement')}
          title=""
          icon={
            <Icon
              type="simple-line-icon"
              name="badge"
              size={24}
              color={theme.colors.white}
            />
          }
          onPress={() => achievement.onGoAchievement()}
          type="clear"
          buttonStyle={[styles.marginLeftLg, styles.noPadding]}
        />
      );
    }
    if (call && (call.onAudioCall || call.onVideoCall)) {
      return (
        <View style={[styles.flexRow, styles.flexCenter, styles.columnGap16]}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Audio call"
            disabled={!isOnline || call.disabledCall}
            onPress={call.onAudioCall}>
            <Icon
              type="material"
              name="call"
              size={24}
              color={theme.colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Video call"
            disabled={!isOnline || call.disabledCall}
            onPress={call.onVideoCall}>
            <Icon
              type="material"
              name="videocam"
              size={24}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      {!isOnline && (
        <View style={componentStyles.offlineView}>
          <Icon name="cloud-off" color={theme.colors.danger} />
          <Text
            accessible={true}
            accessibilityLabel={translate('common.offline')}
            style={componentStyles.offlineText}>
            {translate('common.offline')}
          </Text>
        </View>
      )}
      <View style={componentStyles.header}>
        <View style={componentStyles.headerLeft}>
          {renderLeftComponent()}
        </View>
        <View style={componentStyles.headerCenter}>
          {renderCenterComponent()}
        </View>
        <View style={componentStyles.headerRight}>
          {renderRightComponent()}
        </View>
      </View>
    </>
  );
};

const componentStyles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: variables.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    paddingHorizontal: 10,
    paddingVertical: 12,
    height: 64,
  },
  headerBackButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginLeft: -4,
  },
  headerLogo: {
    height: 40,
    width: 150,
  },
  headerLeft: {
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 1,
    width: 250,
  },
  headerCenter: {
    alignItems: 'center',
    paddingHorizontal: 50,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    zIndex: 0,
  },
  headerRight: {
    alignItems: 'flex-end',
    position: 'relative',
    zIndex: 1,
  },
  offlineView: {
    backgroundColor: 'rgba(229, 35, 30, 0.25)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    height: 40,
  },
  offlineText: {
    color: variables.danger,
    fontSize: 14,
  },
});

export default withTheme(HeaderBar);
