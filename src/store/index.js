/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
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

const store = createStore(
  combineReducers(rootReducers),
  applyMiddleware(...middlewares),
);

export default store;
