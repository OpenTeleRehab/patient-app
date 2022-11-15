/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {initialize, localizeReducer} from 'react-localize-redux';
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
import {partnerLogo} from './partnerLogo/reducers';
import {rocketchat} from './rocketchat/reducers';
import {therapist} from './therapist/reducers';
import {profession} from './profession/reducers';
import {phone} from './phone/reducers';
import settings from '../../config/settings';
import {persistReducer, persistStore, createTransform} from 'redux-persist';
import CryptoJS from 'react-native-crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import {storeLocalData} from '../utils/local_storage';
import {STORAGE_KEY} from '../variables/constants';

AsyncStorage.getItem('persist:OrgHiOpenRehab').then(async (response) => {
  if (response) {
    const store = JSON.parse(response);
    const userData = JSON.parse(store.user);

    if (!userData.encrypted && userData.phone && userData.dial_code) {
      await storeLocalData(STORAGE_KEY.PHONE, userData.phone, false);
      await storeLocalData(STORAGE_KEY.DIAL_CODE, userData.dial_code, false);
    }
  }
});

const rootReducers = {
  localize: localizeReducer,
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
  profession,
  partnerLogo,
  phone,
};

const blacklistTransform = createTransform(
  (inboundState, key) => {
    if (!inboundState) {
      return inboundState;
    }

    if (key === 'user') {
      return _.omit(inboundState, [
        'accessToken',
        'isNewRegister',
        'isDataUpToDate',
        'privacyPolicy',
        'termOfService',
        'isLoading',
      ]);
    } else if (key === 'rocketchat') {
      return {
        ...inboundState,
        messages: [],
        videoCall: {},
        secondaryVideoCall: {},
        selectedRoom: {},
      };
    } else {
      const cryptedText = CryptoJS.AES.encrypt(
        JSON.stringify(inboundState),
        'OrgHiOpenRehabSecret',
      );
      return cryptedText.toString();
    }
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
      error: () => '#E35205',
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
