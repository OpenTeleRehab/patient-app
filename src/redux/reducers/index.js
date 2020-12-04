/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {combineReducers} from 'redux';

import patientReducer from './patient';
import indicatorReducer from './indicator';
import activityReducer from './activity';
import goalReducer from './goal';
import appointmentReducer from './appointment';

const rootReducer = combineReducers({
  patient: patientReducer,
  indicator: indicatorReducer,
  activity: activityReducer,
  goal: goalReducer,
  appointment: appointmentReducer,
});

export default rootReducer;
