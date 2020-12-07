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

const styles = StyleSheet.create({
  ...Layouts,
  ...Typography,
  ...Utilities,
  ...Navigation,
  ...Auth,
  ...HeaderBar,
});

export default styles;
