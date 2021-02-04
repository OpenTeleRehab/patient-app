/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  textDefault: {
    color: variables.black,
  },
  textPrimary: {
    color: variables.primary,
  },
  textLight: {
    color: variables.white,
  },
  textDefaultBold: {
    color: variables.black,
    fontWeight: 'bold',
  },
  textLightBold: {
    color: variables.white,
    fontWeight: 'bold',
  },
  textUpperCase: {
    textTransform: 'uppercase',
  },
  textSmall: {
    fontSize: variables.fontSizeSm,
  },
  bgDark: {
    backgroundColor: variables.grey,
  },
  bgDanger: {
    backgroundColor: variables.error,
  },
  bgPrimary: {
    backgroundColor: variables.primary,
  },
  noneFlex: {
    flex: 0,
  },
  noneBorderBottom: {
    borderBottomWidth: 0,
  },
  noPadding: {
    padding: 0,
  },
  paddingMd: {
    padding: variables.spacingMd,
  },
  marginTop: {
    marginTop: variables.spacingBase,
  },
  paddingY: {
    paddingVertical: variables.spacingBase,
  },
  marginTopMd: {
    marginTop: variables.spacingMd,
  },
  marginTopLg: {
    marginTop: variables.spacingLg,
  },
  marginY: {
    marginVertical: variables.spacingBase,
  },
  marginBottom: {
    marginBottom: variables.spacingBase,
  },
  marginBottomMd: {
    marginBottom: variables.spacingMd,
  },
  marginLeft: {
    marginLeft: variables.spacingBase,
  },
};
