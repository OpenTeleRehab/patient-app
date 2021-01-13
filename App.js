/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-elements';
import {LocalizeProvider} from 'react-localize-redux';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import AppProvider from './AppProvider';
import AppNavigation from './src/components/AppNavigation';
import SplashScreen from './src/components/SplashScreen';
import colors from './src/assets/styles/variables/colors';
import configureStore from './src/store';

const {store, persistor} = configureStore();

const theme = {
  colors,
  Button: {
    raised: true,
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
};

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <PersistGate FlashScreen={<SplashScreen />} persistor={persistor}>
        <AppProvider>
          <LocalizeProvider store={store}>
            <ThemeProvider theme={theme}>
              <StatusBar barStyle="light-content" />
              <AppNavigation />
            </ThemeProvider>
          </LocalizeProvider>
        </AppProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
