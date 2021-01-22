/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import InputSpinner from 'react-native-input-spinner';
import {withTheme} from 'react-native-elements';

const NumericInput = ({theme, value, onChange}) => (
  <InputSpinner
    textColor={theme.colors.white}
    color={theme.colors.primary}
    colorPress={theme.colors.blueLight2}
    background={theme.colors.blueLight}
    rounded={false}
    editable={false}
    value={value}
    onChange={onChange}
  />
);

export default withTheme(NumericInput);
