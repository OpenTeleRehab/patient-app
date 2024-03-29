/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import {StyleSheet} from 'react-native';

import Layouts from './partials/_Layouts';
import Typography from './partials/_Typography';
import Utilities from './partials/_Utilities';
import Navigation from './partials/_Navigation';
import Auth from './partials/_Auth';
import HeaderBar from './partials/_HeaderBar';
import Button from './partials/_Button';
import Form from './partials/_Form';
import UserProfile from './partials/_UserProfile';
import Calendar from './partials/_Calendar';
import ActivityCard from './partials/_ActivityCard';
import Messages from './partials/_Messages';
import Questionnaire from './partials/_Questionnaire';
import Call from './partials/_Call';
import SplashScreen from './partials/_SplashScreen';
import Appointment from './partials/_Appointment';
import MediaPicker from './partials/_MediaPicker';
import Modal from './partials/_Modal';
import Overlay from './partials/_Overlay';

const styles = StyleSheet.create({
  ...Layouts,
  ...Typography,
  ...Utilities,
  ...Navigation,
  ...Auth,
  ...HeaderBar,
  ...Button,
  ...Form,
  ...UserProfile,
  ...Calendar,
  ...ActivityCard,
  ...Messages,
  ...Questionnaire,
  ...Call,
  ...SplashScreen,
  ...Appointment,
  ...MediaPicker,
  ...Modal,
  ...Overlay,
});

export default styles;
