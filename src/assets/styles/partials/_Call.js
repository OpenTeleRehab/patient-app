/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  callContainer: {
    backgroundColor: variables.grey6,
  },
  callerName: {
    textAlign: 'center',
    color: variables.black,
    fontSize: 48,
    paddingBottom: variables.spacingBase,
  },
  callingText: {
    textAlign: 'center',
    color: variables.blueLight,
    fontSize: 20,
    fontStyle: 'italic',
    paddingBottom: variables.spacingBase,
  },
  btnCallOption: {
    alignItems: 'center',
    paddingLeft: variables.spacingLg,
    paddingRight: variables.spacingLg,
    width: '30%',
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
  callOptionIconActive: {
    backgroundColor: variables.black,
    fontWeight: 'bold',
  },
  callActionIcon: {
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 45,
    color: variables.white,
    marginBottom: variables.spacingBase,
    lineHeight: 90,
    height: 90,
    width: 90,
  },
  callDeclineIcon: {
    backgroundColor: variables.red,
  },
  callAcceptIcon: {
    backgroundColor: variables.primary,
  },
  callActionLabel: {
    fontSize: variables.fontSizeMd,
    fontWeight: 'bold',
  },
  callDeclineText: {
    color: variables.red,
  },
  callAcceptText: {
    color: variables.primary,
  },
};
