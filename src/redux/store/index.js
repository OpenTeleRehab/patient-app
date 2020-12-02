/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import rootReducers from '../reducers';
import settings from '../../../config/settings';

const persistConfig = {
  key: 'OrgHiPatientApp',
  storage: AsyncStorage,
};

const middlewares = [thunk];

if (settings.isDebugMode) {
  const {createLogger} = require('redux-logger');
  let logger = createLogger({
    duration: true,
    colors: {
      title: () => '#202020',
      action: () => '#0077C8',
      prevState: () => '#5BC2E7',
      nextState: () => '#039995',
      error: () => '#E35205',
    },
  });
  middlewares.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducers);

export default () => {
  const store = createStore(persistedReducer, applyMiddleware(...middlewares));
  const persistor = persistStore(store);
  return {store, persistor};
};
