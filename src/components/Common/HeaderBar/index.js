/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {Image} from 'react-native';
import {Header, Text, Button, withTheme} from 'react-native-elements';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';

const HeaderBar = (props) => {
  const {theme, title, onGoBack, leftContent, rightContent} = props;

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
          <Text h4 style={styles.textLight}>
            {label}
          </Text>
        );
      }
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
      const {icon, iconType, iconSize, label, onPress} = rightContent;
      return (
        <Button
          title={label}
          icon={
            icon
              ? {
                  name: icon,
                  type: iconType,
                  color: theme.colors.white,
                  size: iconSize || 20,
                }
              : null
          }
          type={label ? 'outline' : 'clear'}
          titleStyle={styles.textLight}
          buttonStyle={styles.headerButton(label)}
          onPress={onPress}
        />
      );
    }
    return <Text style={styles.textPrimary}>Empty</Text>;
  };

  return (
    <Header
      leftComponent={renderLeftComponent()}
      centerComponent={renderCenterComponent()}
      rightComponent={renderRightComponent()}
      leftContainerStyle={styles.noneFlex}
      centerContainerStyle={styles.textLight}
      rightContainerStyle={styles.noneFlex}
      containerStyle={styles.noneBorderBottom}
    />
  );
};

export default withTheme(HeaderBar);
