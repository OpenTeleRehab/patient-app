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
  },
  chatSendButton: {
    position: 'absolute',
    bottom: 12,
    right: 15,
    height: 28,
  },
};
