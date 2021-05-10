/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {Image} from 'react-native';
import {Header, Text, Button, withTheme} from 'react-native-elements';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';
import {useSelector} from 'react-redux';
import {CALL_STATUS} from '../../../variables/constants';
import {useNetInfo} from '@react-native-community/netinfo';
import {getTranslate} from 'react-localize-redux';

const leftContainerMaxWidth = {maxWidth: '70%'};

const HeaderBar = (props) => {
  const {theme, title, onGoBack, leftContent, rightContent} = props;
  const {videoCall} = useSelector((state) => state.rocketchat);
  const netInfo = useNetInfo();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

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
          <Text h4 numberOfLines={1} style={styles.textLight}>
            {label}
          </Text>
        );
      }
      return leftContent;
    }
    return <Text style={styles.textPrimary}>Empty</Text>;
  };

  const renderCenterComponent = () => {
    if (title) {
      return <Text style={styles.headerTitle}>{title}</Text>;
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
                  color: disabled ? theme.colors.disabled : theme.colors.white,
                  size: iconSize || 20,
                }
              : null
          }
          type={label ? 'outline' : 'clear'}
          titleStyle={styles.textLight}
          buttonStyle={styles.headerButton(label)}
          onPress={onPress}
          disabled={disabled}
        />
      );
    }
    return <Text style={styles.textPrimary}>Empty</Text>;
  };

  return (
    <>
      {netInfo.type !== 'unknown' && netInfo.isConnected === false && (
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
          netInfo.type !== 'unknown' &&
            netInfo.isConnected === false &&
            styles.headerWorkAround,
        ]}
      />
    </>
  );
};

export default withTheme(HeaderBar);
