import React from 'react';
import {Text} from 'react-native';
import {withTheme} from 'react-native-elements';
import styles from '../../assets/styles';

const HelperText = ({message}) => {
  return (
    <Text
      accessibilityLabel={message}
      style={[styles.marginTopSm, styles.fontSizeXs, styles.textDanger]}>
      {message}
    </Text>
  );
};

export default withTheme(HelperText);
