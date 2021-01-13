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
});

export default styles;
