/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  navTabBar: {
    borderTopWidth: 1,
    borderTopColor: variables.grey8,
  },
  navTabLabel: {
    fontSize: 12,
  },
  navTabBadge: {
    color: variables.danger,
    backgroundColor: variables.danger,
    maxWidth: 12,
    maxHeight: 12,
  },
  navTabIcon: {
    height: 26,
    width: 26,
  },
  navDrawerContainer: {
    flex: 1,
    paddingTop: variables.spacingLg,
    paddingBottom: variables.spacingMd,
  },
  navDrawerBottomContainer: {
    marginHorizontal: variables.spacingMd,
  },
  navDrawerBottom: {
    marginTop: variables.spacingMd,
  },
  navKidThemeWrapper: {
    backgroundColor: variables.grey6,
    padding: variables.spacingMd,
  },
  navDrawerBackBottom: {
    padding: variables.spacingBase - 4,
  },
};
