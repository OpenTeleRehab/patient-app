import React from 'react';
import {Text} from 'react-native';
import {withTheme} from 'react-native-elements';
import styles from '../../assets/styles';

const QuestionText = ({error = false, questionText}) => {
  return (
    <Text
      accessibilityLabel={questionText}
      style={
        error
          ? [styles.fontWeightMedium, styles.textDanger]
          : styles.fontWeightMedium
      }>
      {questionText}
    </Text>
  );
};

export default withTheme(QuestionText);
