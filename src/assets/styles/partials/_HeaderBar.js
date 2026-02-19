/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 22,
  },
  headerButton: (hasLabel, backgroundPrimary) => ({
    paddingVertical: hasLabel ? variables.spacingSm : 0,
    paddingHorizontal: hasLabel ? variables.spacingBase : 0,
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
  backgroundPrimary: {
    backgroundColor: variables.primary,
  },
  backgroundWhite: {
    backgroundColor: variables.white,
  },
  backgroundGrayLight: {
    backgroundColor: variables.grey9,
  },
};
