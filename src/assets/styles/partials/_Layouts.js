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
    flex: 1,
    flexDirection: 'row',
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  alignSelfStretch: {
    alignSelf: 'stretch',
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
