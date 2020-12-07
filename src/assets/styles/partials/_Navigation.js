/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  navTabBar: {
    borderTopWidth: 1,
    borderTopColor: variables.primary,
    position: 'absolute',
    zIndex: 10,
  },
  navTabLabel: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  navTabBadge: {
    color: variables.error,
    backgroundColor: variables.error,
    maxWidth: 12,
    maxHeight: 12,
  },
  navDrawerContainer: {
    flex: 1,
    paddingBottom: 70,
  },
  navDrawerBottom: {
    marginHorizontal: variables.spacingMd,
  },
};
