/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

const headerButtonStyles = (hasLabel) => ({
  borderRadius: 50,
  padding: hasLabel ? variables.spacingSm : 0,
});

export default {
  headerLogo: {
    width: 94,
    height: 40,
  },
  headerButton: (hasLabel) => ({
    ...headerButtonStyles(hasLabel),
    backgroundColor: variables.primary,
    borderColor: 'white',
  }),
  headerButtonLight: (hasLabel) => ({
    ...headerButtonStyles(hasLabel),
    borderColor: variables.black,
  }),
};
