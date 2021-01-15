/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  mainContainerPrimary: {
    flex: 1,
    padding: variables.spacingBase,
    backgroundColor: variables.primary,
  },
  mainContainerLight: {
    flex: 1,
    padding: variables.spacingBase,
    backgroundColor: 'white',
  },
  flexCenter: {
    flex: 1,
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  alignSelfStretch: {
    alignSelf: 'stretch',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
};
