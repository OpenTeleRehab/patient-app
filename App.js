/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-elements';
import {LocalizeProvider} from 'react-localize-redux';
import {Provider} from 'react-redux';
import AppProvider from './AppProvider';
import AppNavigation from './src/components/AppNavigation';
import colors from './src/assets/styles/variables/colors';
import store from './src/store';

const theme = {
  colors,
  Button: {
    raised: true,
  },
  ButtonGroup: {
    containerStyle: {
      marginHorizontal: 0,
    },
  },
  CheckBox: {
    containerStyle: {
      borderWidth: 0,
      padding: 0,
      marginLeft: 0,
      marginRight: 0,
      backgroundColor: 'none',
    },
  },
  Slider: {
    thumbStyle: {
      height: 40,
      width: 10,
      backgroundColor: colors.blueDark,
    },
    trackStyle: {
      height: 10,
    },
    minimumTrackTintColor: colors.primary,
  },
};

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <AppProvider>
        <LocalizeProvider store={store}>
          <ThemeProvider theme={theme}>
            <StatusBar barStyle="light-content" />
            <AppNavigation />
          </ThemeProvider>
        </LocalizeProvider>
      </AppProvider>
    </Provider>
  );
};

export default App;
