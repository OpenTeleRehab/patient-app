/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */

export default {
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  modalButtonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
};
