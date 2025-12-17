/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Icon, Input, withTheme} from 'react-native-elements';
import {StyleSheet} from 'react-native';

const TextField = (props) => {
  const {label, variant, secureTextEntry, labelStyle, inputStyle, keyboardType} = props;

  const [showSecureTextEntry, setShowSecureTextEntry] =
    useState(secureTextEntry);

  if (secureTextEntry) {
    props = {
      ...props,
      secureTextEntry: showSecureTextEntry,
      rightIcon: (
        <Icon
          name={showSecureTextEntry ? 'visibility' : 'visibility-off'}
          size={20}
          onPress={() => setShowSecureTextEntry(!showSecureTextEntry)}
        />
      ),
    };
  }

  return (
    <Input
      containerStyle={componentStyles.containerStyle}
      labelStyle={labelStyle ? labelStyle : componentStyles.labelStyle}
      inputContainerStyle={
        variant === 'filled' && componentStyles.inputContainerStyle
      }
      disabledInputStyle={componentStyles.disabledInputStyle}
      errorStyle={componentStyles.errorStyle}
      accessibilityLabel={label}
      inputStyle={inputStyle}
      keyboardType={keyboardType}
      {...props}
    />
  );
};

const componentStyles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  inputContainerStyle: {
    backgroundColor: '#E6E8EA',
    borderRadius: 6,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
  },
  labelStyle: {
    color: '#333333',
    fontSize: 14,
    fontWeight: 400,
    marginBottom: 8,
  },
  disabledInputStyle: {
    opacity: 1,
  },
  errorStyle: {
    marginHorizontal: 0,
  },
});

export default withTheme(TextField);
