/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  formLabel: {
    color: variables.black,
    fontSize: variables.fontSizeBase,
    fontWeight: '500',
    marginBottom: variables.spacingBase,
  },
  formControl: {
    borderWidth: 1,
    borderColor: variables.inputBorderColor,
    borderRadius: variables.borderRadiusBase,
    paddingHorizontal: variables.spacingBase,
    marginTop: variables.spacingSm,
  },
  formPinContainer: {
    height: 70,
  },
  formPinCell: {
    borderWidth: 1,
    borderRadius: variables.borderRadiusBase,
    borderColor: variables.inputBorderColor,
    paddingVertical: variables.spacingLg,
  },
  formPinCellFocused: {
    borderColor: variables.primary,
  },
  formPinCellFilled: {
    borderColor: variables.primary,
  },
  formPinText: {
    fontSize: 24,
    color: variables.primary,
  },
  formPinCustomMask: {
    width: 14,
    height: 14,
    borderRadius: 25,
    backgroundColor: variables.primary,
  },
};
