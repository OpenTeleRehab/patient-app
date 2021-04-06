/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  chatMainContainer: {
    backgroundColor: variables.greyOutline,
    padding: 0,
    paddingBottom: variables.spacingMd,
  },
  chatDay: {
    color: variables.grey,
    fontWeight: 'bold',
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
  chatInputToolBar: {
    padding: variables.spacingBase,
    paddingRight: 0,
    paddingBottom: 7,
    borderTopWidth: 0,
    backgroundColor: '#FAFAFA',
  },
  chatComposer: {
    borderRadius: variables.borderRadiusBase,
    borderWidth: 1,
    borderColor: variables.grey4,
    padding: variables.spacingBase,
    paddingRight: 45,
    marginRight: variables.spacingBase,
    lineHeight: 20,
  },
  chatAttachment: {
    marginLeft: 0,
  },
  chatSendButton: {
    position: 'absolute',
    bottom: 12,
    right: 15,
    height: 28,
  },
  chatTherapistNotOnlineText: {
    color: variables.grey1,
    fontSize: variables.fontSizeMd,
    textAlign: 'center',
    lineHeight: 24,
  },
};
