/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {combineReducers} from 'redux';

import patientReducer from './patientReducer';
import indicatorReducer from './indicatorReducer';
import activityReducer from './activityReducer';

const rootReducer = combineReducers({
  patient: patientReducer,
  indicator: indicatorReducer,
  activity: activityReducer,
});

export default rootReducer;
