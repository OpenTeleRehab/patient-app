/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  calendarContainer: {
    height: 120,
    paddingTop: 10,
  },
  calendarHeader: {
    fontWeight: variables.fontWeightDefault,
    marginLeft: variables.spacingBase,
  },
  calendarHeaderContainer: {
    fontWeight: variables.fontWeightDefault,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateNumber: {
    color: variables.black,
    fontSize: 14,
    fontWeight: variables.fontWeightDefault,
  },
  dateName: {
    color: variables.black,
    fontWeight: variables.fontWeightDefault,
  },
  dateContainerToday: {
    backgroundColor: variables.white,
  },
  dateContainerWeekend: {
    backgroundColor: variables.danger,
    borderRadius: 0,
    width: '100%',
  },
  dateContainerSelected: {
    backgroundColor: variables.blueLight2,
    borderRadius: 0,
    color: variables.white,
    width: '100%',
  },
  highlightDateNumber: {
    color: variables.white,
    fontWeight: variables.fontWeightDefault,
  },
  highlightDateNumberSelected: {
    fontSize: 14,
    fontWeight: variables.fontWeightDefault,
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
  calendarIconStyle: {
    width: 30,
    height: 20,
  },
};
