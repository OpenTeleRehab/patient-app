/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ThemeProvider} from 'react-native-elements';
import {LocalizeProvider} from 'react-localize-redux';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppProvider from './AppProvider';
import AppNavigation from './src/components/AppNavigation';
import colors from './src/assets/styles/variables/colors';
import VideoCall from './src/components/VideoCall';
import {PersistGate} from 'redux-persist/integration/react';
import {CallContextProvider} from './src/context/CallContext';
import store, {persistor} from './src/store';

export const theme = {
  colors,
  Button: {
    raised: false,
    buttonStyle: {
      borderRadius: 8,
      paddingHorizontal: 30,
    },
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

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocalizeProvider store={store}>
          <SafeAreaProvider>
            <AppProvider>
              <ThemeProvider theme={theme}>
                <AppNavigation />
                <CallContextProvider>
                  <VideoCall />
                </CallContextProvider>
              </ThemeProvider>
            </AppProvider>
          </SafeAreaProvider>
        </LocalizeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
