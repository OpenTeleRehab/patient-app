/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  // TODO why video ended break header
  headerWorkAround: {
    height: 56,
    paddingTop: 0,
    borderBottomWidth: 0,
  },
  headerLogo: {
    width: 94,
    height: 40,
  },
  headerBackButton: {
    paddingLeft: 0,
    marginLeft: -5,
  },
  headerButton: (hasLabel) => ({
    padding: hasLabel ? variables.spacingSm : 0,
    borderRadius: 50,
    backgroundColor: variables.primary,
    borderColor: variables.white,
  }),
  headerTitle: {
    color: variables.white,
    fontSize: 17,
  },
  offlineText: {
    textAlign: 'center',
    backgroundColor: variables.white,
    color: variables.warning,
    paddingTop: '7%',
    paddingBottom: '0.6%',
  },
};
