/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import variables from '../variables';

const btnLightOutlineStyles = {
  backgroundColor: variables.primary,
  borderColor: 'white',
};

export default {
  btnLight: {
    backgroundColor: 'white',
  },
  btnCircle: {
    borderRadius: 50,
  },
  btnLightCircle: {
    backgroundColor: 'white',
    borderRadius: 50,
  },
  btnLightOutline: {
    ...btnLightOutlineStyles,
  },
  btnLightOutlineCircle: {
    ...btnLightOutlineStyles,
    borderRadius: 50,
  },
  stickyButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  stickyButtonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  stickyButtonStyle: {
    height: 48,
  },
  stickyDisabledTitleStyle: {
    color: variables.grey1,
  },
};
