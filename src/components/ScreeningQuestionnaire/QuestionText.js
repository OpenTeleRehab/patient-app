import React from 'react';
import {Text} from 'react-native';
import {withTheme} from 'react-native-elements';
import styles from '../../assets/styles';

const QuestionText = ({error = false, questionText, required = 0}) => {
  return (
    <Text
      accessibilityLabel={questionText}
      style={
        error
          ? [styles.fontWeightMedium, styles.textDanger]
          : styles.fontWeightMedium
      }>
      {questionText} {required === 1 && <Text style={styles.textDanger}>*</Text>}
    </Text>
  );
};

export default withTheme(QuestionText);
