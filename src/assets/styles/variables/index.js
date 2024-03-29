/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import colors from './colors';

export default {
  ...colors,
  fontSizeBase: 16,
  fontWeightLight: '300',
  fontWeightDefault: '400',
  fontWeightMedium: '500',
  fontWeightBold: '600',
  get fontSizeSm() {
    return this.fontSizeBase - 2;
  },
  get fontSizeMd() {
    return this.fontSizeBase + 2;
  },
  get fontSizeLg() {
    return this.fontSizeBase + 4;
  },
  get fontSizeXLg() {
    return this.fontSizeBase + 8;
  },
  spacingBase: 10,
  get spacingSm() {
    return this.spacingBase - 5;
  },
  get spacingMd() {
    return this.spacingBase + 10;
  },
  get spacingLg() {
    return this.spacingBase + 20;
  },
  borderRadiusBase: 5,
  get inputBorderColor() {
    return this.grey1;
  },
};
