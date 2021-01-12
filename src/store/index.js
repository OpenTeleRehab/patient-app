/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {user} from './user/reducers';
import {indicator} from './indicator/reducers';
import {activity} from './activity/reducers';
import {goal} from './goal/reducers';
import {appointment} from './appointment/reducers';
import settings from '../../config/settings';

const rootReducers = {
  user,
  indicator,
  activity,
  goal,
  appointment,
};

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

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(rootReducers),
);

export default () => {
  const store = createStore(persistedReducer, applyMiddleware(...middlewares));
  const persistor = persistStore(store);
  return {store, persistor};
};
