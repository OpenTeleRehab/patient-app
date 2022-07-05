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
    width: 150,
    height: 40,
  },
  headerBackButton: {
    paddingLeft: 0,
    marginLeft: -5,
  },
  headerButton: (hasLabel, backgroundPrimary) => ({
    paddingVertical: hasLabel ? variables.spacingSm : 0,
    paddingHorizontal: hasLabel ? variables.spacingMd : 0,
    borderRadius: 8,
    backgroundColor: backgroundPrimary ? variables.primary : variables.white,
    borderColor: backgroundPrimary ? variables.white : variables.primary,
    borderWidth: 1,
  }),
  headerLeftTitleLight: {
    color: variables.white,
    fontSize: 24,
    fontWeight: variables.fontWeightBold,
  },
  headerLeftTitleDark: {
    color: variables.dark,
    fontSize: 24,
    fontWeight: variables.fontWeightBold,
  },
  headerCenterTitleLight: {
    color: variables.white,
    fontSize: 18,
    marginLeft: variables.spacingSm,
  },
  headerCenterTitleDark: {
    color: variables.dark,
    fontSize: 18,
    marginLeft: variables.spacingSm,
  },
  offlineText: {
    textAlign: 'center',
    backgroundColor: variables.white,
    color: variables.warning,
    paddingTop: '7%',
    paddingBottom: '0.6%',
  },
  backgroundPrimary: {
    backgroundColor: variables.primary,
  },
  backgroundWhite: {
    backgroundColor: variables.white,
  },
};
