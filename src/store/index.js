/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {initialize, localizeReducer} from 'react-localize-redux';
import {register} from './register/reducers';
import {user} from './user/reducers';
import {indicator} from './indicator/reducers';
import {activity} from './activity/reducers';
import {achievement} from './achievement/reducers';
import {goal} from './goal/reducers';
import {appointment} from './appointment/reducers';
import {country} from './country/reducers';
import {language} from './language/reducers';
import {translation} from './translation/reducers';
import {staticPage} from './staticPage/reducers';
import {rocketchat} from './rocketchat/reducers';
import {therapist} from './therapist/reducers';
import {clinic} from './clinic/reducers';
import {profession} from './profession/reducers';
import {phone} from './phone/reducers';
import {assistiveTechnology} from './assistiveTechnology/reducers';
import {survey} from './survey/reducers';
import settings from '../../config/settings';
import {persistReducer, persistStore, createTransform} from 'redux-persist';
import CryptoJS from 'react-native-crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import {appSettings} from './appSetting/reducers';
import {patient} from './patient/reducers';
import {screeningQuestionnaire} from './screeningQuestionnaire/reducers';
import {phcService} from './phcService/reducers';
import {region} from './region/reducers';
import {province} from './province/reducers';
import {transfer} from './transfer/reducers';
import {phcAppointment} from './phcAppointment/reducers';

const rootReducers = {
  localize: localizeReducer,
  register,
  user,
  indicator,
  activity,
  achievement,
  goal,
  appointment,
  country,
  language,
  translation,
  staticPage,
  rocketchat,
  therapist,
  clinic,
  profession,
  phone,
  appSettings,
  assistiveTechnology,
  survey,
  patient,
  screeningQuestionnaire,
  phcService,
  region,
  province,
  transfer,
  phcAppointment,
};

const blacklistTransform = createTransform(
  (inboundState, key) => {
    if (!inboundState) {
      return inboundState;
    }

    let inboundStateData = inboundState;

    if (key === 'user') {
      inboundStateData = _.omit(inboundState, [
        'accessToken',
        'isDataUpToDate',
        'privacyPolicy',
        'termOfService',
        'isLoading',
      ]);
    } else if (key === 'rocketchat') {
      inboundStateData = {
        ...inboundState,
        callAccessToken: undefined,
        messages: [],
        videoCall: {},
        secondaryVideoCall: {},
        selectedRoom: {},
      };
    } else if (key === 'register') {
      inboundStateData = _.omit(inboundState, [
        'countryCode',
        'dial_code',
        'phone',
        'email',
        'password',
        'tempAccessToken',
        'registerAs',
      ]);
    }

    const cryptedText = CryptoJS.AES.encrypt(
      JSON.stringify(inboundStateData),
      'OrgHiOpenRehabSecret',
    );

    return cryptedText.toString();
  },
  (outboundState, key) => {
    if (!outboundState) {
      return outboundState;
    }

    const bytes = CryptoJS.AES.decrypt(outboundState, 'OrgHiOpenRehabSecret');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  },
);

const persistConfig = {
  key: 'OrgHiOpenRehab',
  storage: AsyncStorage,
  blacklist: ['indicator'],
  transforms: [blacklistTransform],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(rootReducers),
);

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
      error: () => '#E5231E',
    },
  });
  middlewares.push(logger);
}

const languages = [{name: 'English', code: 'en'}];
const defaultLanguage = 'en';
const onMissingTranslation = ({translationId}) => translationId;

const store = createStore(persistedReducer, applyMiddleware(...middlewares));

store.dispatch(
  initialize({
    languages,
    options: {
      defaultLanguage,
      renderToStaticMarkup: false,
      onMissingTranslation,
    },
  }),
);

export default store;
export const persistor = persistStore(store);
