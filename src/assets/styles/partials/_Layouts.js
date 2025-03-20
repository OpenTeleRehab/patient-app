/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  mainContainerPrimary: {
    padding: variables.spacingBase,
    backgroundColor: variables.primary,
  },
  mainContainerLight: {
    flexGrow: 1,
    padding: variables.spacingBase,
    backgroundColor: 'white',
  },
  flexCenter: {
    flex: 1,
    alignItems: 'center',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  alignSelfStretch: {
    alignSelf: 'stretch',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentSpaceAround: {
    justifyContent: 'space-around',
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
};
