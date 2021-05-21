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
    paddingBottom: variables.spacingMd,
  },
  navDrawerBottom: {
    marginHorizontal: variables.spacingMd,
  },
};
