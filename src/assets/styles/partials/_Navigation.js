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
  navDrawerBottom: {
    marginHorizontal: variables.spacingMd,
  },
  navKidThemeWrapper: {
    backgroundColor: variables.grey6,
    padding: variables.spacingMd,
  },
};
