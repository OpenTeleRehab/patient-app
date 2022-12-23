/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  callContainer: {
    flex: 1,
    backgroundColor: variables.grey6,
    height: '100%',
    width: '100%',
  },
  callerName: {
    fontSize: 48,
    paddingBottom: variables.spacingBase,
  },
  callingText: {
    color: variables.blueLight,
    fontSize: 20,
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
    fontWeight: variables.fontWeightBold,
  },
  videoMeetingWrapper: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  participantContainer: {
    backgroundColor: variables.black,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    elevation: 1,
    zIndex: 1,
  },
  participantView: {
    position: 'relative',
    height: '100%',
    width: '100%',
    elevation: 1,
    zIndex: 1,
  },
  localVideoContainer: {
    backgroundColor: variables.dark,
    width: 150,
    height: 250,
    position: 'absolute',
    right: 10,
    top: 10,
    elevation: 99,
    zIndex: 99,
  },
  localVideoView: {
    width: 150,
    height: 250,
  },
  localVideoAvatar: {
    position: 'absolute',
    top: 10,
    left: 10,
    elevation: 99,
    zIndex: 99,
  },
  callOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    elevation: 99,
    zIndex: 99,
  },
  optionButton: {
    marginHorizontal: variables.spacingMd,
  },
};
