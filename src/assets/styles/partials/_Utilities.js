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
  textDanger: {
    color: variables.danger,
  },
  textWarning: {
    color: variables.warning,
  },
  textLight: {
    color: variables.white,
  },
  textLightGrey: {
    color: variables.grey4,
  },
  textDefaultBold: {
    color: variables.black,
    fontWeight: variables.fontWeightBold,
  },
  textLightBold: {
    color: variables.white,
    fontWeight: variables.fontWeightBold,
  },
  textUpperCase: {
    textTransform: 'uppercase',
  },
  textSmall: {
    fontSize: variables.fontSizeSm,
  },
  textCenter: {
    textAlign: 'center',
  },
  textWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bgBlack: {
    backgroundColor: variables.dark,
  },
  bgLight: {
    backgroundColor: variables.white,
  },
  bgDark: {
    backgroundColor: variables.black,
  },
  bgDanger: {
    backgroundColor: variables.danger,
  },
  bgPrimary: {
    backgroundColor: variables.primary,
  },
  bgSuccess: {
    backgroundColor: variables.success,
  },
  bgGrey: {
    backgroundColor: variables.grey,
  },
  bgGreyLight: {
    backgroundColor: variables.grey9,
  },
  bgOrangeLight: {
    backgroundColor: variables.orangeLight,
  },
  bgBlueDark: {
    backgroundColor: variables.blueDark,
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
  paddingY: {
    paddingVertical: variables.spacingBase,
  },
  paddingX: {
    paddingHorizontal: variables.spacingBase,
  },
  paddingYMd: {
    paddingVertical: variables.spacingMd,
  },
  paddingYSm: {
    paddingHorizontal: variables.spacingBase,
  },
  paddingXMd: {
    paddingHorizontal: variables.spacingMd,
  },
  paddingXLg: {
    paddingHorizontal: variables.spacingLg,
  },
  margin: {
    margin: variables.spacingBase,
  },
  marginTop: {
    marginTop: variables.spacingBase,
  },
  marginTopSm: {
    marginTop: variables.spacingBase - 8,
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
  marginXMd: {
    marginHorizontal: variables.spacingMd,
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
  marginLeftSm: {
    marginLeft: variables.spacingBase / 2,
  },
  marginLeftLg: {
    marginLeft: variables.spacingLg,
  },
  marginRight: {
    marginRight: variables.spacingBase,
  },
  marginRightSm: {
    marginRight: variables.spacingBase / 2,
  },
  displayNone: {
    height: 0,
    width: 0,
  },
  width70: {
    width: '70%',
  },
  reject: {
    backgroundColor: variables.danger,
    paddingHorizontal: variables.spacingBase,
  },
};
