/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  headerLogo: {
    width: 94,
    height: 40,
  },
  headerButton: (hasLabel) => ({
    borderColor: 'white',
    borderRadius: 50,
    padding: hasLabel ? variables.spacingSm : 0,
  }),
  headerButtonLight: (hasLabel) => ({
    borderColor: variables.black,
    borderRadius: 50,
    padding: hasLabel ? variables.spacingSm : 0,
  }),
};
