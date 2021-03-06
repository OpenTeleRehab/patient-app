/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  mpContainer: {
    backgroundColor: variables.white,
    height: '100%',
    width: '100%',
  },
  mpHeader: {
    backgroundColor: variables.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: variables.grey6,
    height: 48,
    paddingHorizontal: variables.spacingBase,
    alignItems: 'center',
  },
  mpMediaAlbum: {
    flexGrow: 1,
    maxWidth: '45%',
  },
  mpWrapper: {
    flexGrow: 1,
    padding: variables.spacingBase,
  },
  mpCaptionContainer: {
    position: 'absolute',
    borderTopWidth: 1,
    bottom: 0,
    width: '100%',
    borderColor: variables.grey6,
    backgroundColor: variables.white,
    zIndex: 20,
  },
  mpCaptionInput: {
    height: 50,
  },
  mpMediaContainer: {
    paddingRight: variables.spacingSm,
    paddingBottom: variables.spacingSm,
  },
  mpMediaItem: (size, isSelected) => ({
    width: size,
    height: size,
    borderRadius: isSelected ? 15 : 0,
    borderWidth: isSelected ? 1 : 0,
    borderColor: variables.primary,
  }),
  mpMediaSelection: {
    position: 'absolute',
    top: 5,
    right: 10,
    zIndex: 10,
  },
  pickerSelectInputIOS: {
    top: 0,
  },
  pickerSelectInputAndroid: {
    top: 18,
  },
};
