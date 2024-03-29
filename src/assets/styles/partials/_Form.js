/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  formGroup: {
    marginBottom: variables.spacingBase,
  },
  formLabel: {
    color: variables.black,
    fontSize: variables.fontSizeSm,
    fontWeight: variables.fontWeightMedium,
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
    height: 60,
  },
  formPinCellFocused: {
    borderColor: variables.primary,
  },
  formPinCellFilled: {
    borderColor: variables.primary,
  },
  formPinText: {
    color: variables.primary,
    fontSize: 24,
  },
  formPinCustomMask: {
    width: 14,
    height: 14,
    borderRadius: 25,
    backgroundColor: variables.primary,
  },
  formControlDate: {
    paddingLeft: 0,
    height: 80,
  },
  formControlDateInput: {
    color: variables.black,
    opacity: 1,
    fontSize: variables.fontSizeBase,
  },
  textFormDisabled: {
    paddingVertical: variables.spacingBase,
    paddingLeft: variables.spacingBase,
    fontSize: variables.fontSizeBase,
    color: variables.black,
  },
  inputContainer: {
    height: 80,
    paddingLeft: 1,
  },
  formPinCellError: {
    borderColor: variables.danger,
  },
  formPinTextError: {
    fontSize: 24,
    color: variables.danger,
  },
};
