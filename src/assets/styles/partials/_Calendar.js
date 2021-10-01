/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  dateContainerToday: {
    backgroundColor: variables.blueLight2,
  },
  dateContainerWeekend: {
    backgroundColor: variables.danger,
    borderRadius: 0,
    width: '100%',
  },
  dateContainerSelected: {
    backgroundColor: variables.blueLight2,
    borderRadius: 0,
    width: '100%',
  },
  dateContainer: {
    backgroundColor: variables.grey7,
    borderRadius: 0,
    width: '100%',
  },
  todayButton: {
    position: 'absolute',
    zIndex: 1,
    top: 5,
    right: 10,
  },
};
