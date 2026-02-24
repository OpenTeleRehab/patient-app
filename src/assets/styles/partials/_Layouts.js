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
  mainContainerLightPaddingMd: {
    flexGrow: 1,
    padding: variables.spacingMd,
    backgroundColor: variables.white,
  },
  mainContainerLightPaddingYMd: {
    flexGrow: 1,
    paddingVertical: variables.spacingMd,
    backgroundColor: variables.white,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: variables.primary,
  },
  flex1: {
    flex: 1,
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
  flexDirectionRow: {
    flexDirection: 'row',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  flexGrow: {
    flexGrow: 1,
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
  alignItemsCenter: {
    alignItems: 'center',
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
  rowGap15: {
    rowGap: 15,
  },
  rowGap10: {
    rowGap: 10,
  },
  rowGap5: {
    rowGap: 5,
  },
  rowGap2: {
    rowGap: 2,
  },
  columnGap16: {
    columnGap: 16,
  },
  columnGap10: {
    columnGap: 10,
  },
  columnGap2: {
    columnGap: 2,
  },
};
