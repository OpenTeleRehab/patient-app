import React from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import styles from '../../../assets/styles';

const AppKeyboardView = ({children}) => {
  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default AppKeyboardView;
