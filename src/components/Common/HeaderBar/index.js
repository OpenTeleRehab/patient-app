/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {Image} from 'react-native';
import {Header, Text, Button, withTheme} from 'react-native-elements';

import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';

const HeaderBar = (props) => {
  const {theme, title, light, rightContent} = props;

  const renderLeftComponent = () => {
    if (title) {
      return (
        <Text h4 style={!light ? styles.textLight : null}>
          {title}
        </Text>
      );
    }
    return <Image source={logoWhite} style={styles.headerLogo} />;
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
                  color: light ? theme.colors.black : 'white',
                  size: iconSize || 20,
                }
              : null
          }
          type={label ? 'outline' : 'clear'}
          titleStyle={light ? styles.textDefault : styles.textLight}
          buttonStyle={
            light ? styles.headerButtonLight(label) : styles.headerButton(label)
          }
          onPress={onPress}
        />
      );
    }
  };

  return (
    <Header
      leftComponent={renderLeftComponent()}
      rightComponent={renderRightComponent()}
      leftContainerStyle={styles.noneFlex}
      rightContainerStyle={styles.noneFlex}
      containerStyle={styles.noneBorderBottom}
      backgroundColor={light ? 'white' : theme.colors.primary}
    />
  );
};

export default withTheme(HeaderBar);
