/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ThemeProvider} from 'react-native-elements';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';

import SplashScreen from './src/components/SplashScreen';
import configureStore from './src/redux/store';
const {store, persistor} = configureStore();

import colors from './theme/variables';

const theme = {
  colors,
};

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <SplashScreen />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
