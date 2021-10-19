/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  chatMainContainer: {
    backgroundColor: variables.greyOutline,
    padding: 0,
  },
  chatDay: {
    color: variables.grey,
    fontFamily: variables.fontFamilyBold,
  },
  chatBubbleLeft: {
    backgroundColor: variables.white,
    borderRadius: 15,
  },
  chatBubbleRight: {
    backgroundColor: variables.primary,
    borderRadius: 15,
  },
  chatAttachmentContainer: {
    width: 150,
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  chatMessageImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  chatMessageVideo: {
    width: '100%',
    height: 100,
    borderRadius: 15,
  },
  chatComposer: {
    borderRadius: variables.borderRadiusBase,
    fontSize: variables.fontSizeSm,
    paddingRight: 45,
    marginRight: variables.spacingBase,
    lineHeight: 18,
  },
  chatAttachment: {
    height: 26,
  },
  chatSendButton: {
    position: 'absolute',
    bottom: 9,
    right: 15,
    height: 28,
  },
  chatTherapistNotOnlineText: {
    color: variables.grey1,
    fontSize: variables.fontSizeMd,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalHeaderAction: {
    position: 'absolute',
    padding: variables.spacingSm,
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 99,
  },
};
