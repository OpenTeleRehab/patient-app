/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  callContainer: {
    backgroundColor: variables.grey6,
  },
  callerName: {
    fontSize: 48,
    paddingBottom: variables.spacingBase,
  },
  callingText: {
    color: variables.blueLight,
    fontSize: 20,
    fontStyle: 'italic',
    paddingBottom: variables.spacingBase,
  },
  btnCallOption: {
    width: 100,
  },
  btnCallAction: {
    alignItems: 'center',
    paddingLeft: variables.spacingLg,
    paddingRight: variables.spacingLg,
  },
  callOptionIcon: {
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: variables.grey2,
    borderRadius: 25,
    color: variables.white,
    marginBottom: variables.spacingBase,
    lineHeight: 50,
    height: 50,
    width: 50,
  },
  callActionIcon: {
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 40,
    color: variables.white,
    marginBottom: variables.spacingBase,
    lineHeight: 80,
    height: 80,
    width: 80,
  },
  callActionLabel: {
    fontSize: variables.fontSizeMd,
    fontWeight: 'bold',
  },
  videoMeetingWrapper: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
};
