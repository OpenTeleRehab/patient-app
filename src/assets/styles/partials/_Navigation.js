/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  navTabBar: {
    borderTopWidth: 1,
    borderTopColor: variables.primary,
  },
  navTabLabel: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  navTabBadge: {
    color: variables.danger,
    backgroundColor: variables.danger,
    maxWidth: 12,
    maxHeight: 12,
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
  navKidThemeLabel: {
    width: '70%',
  },
};
