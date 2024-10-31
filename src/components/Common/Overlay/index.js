/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const CommonOverlay = ({visible, onClose, children}) => {
  return (
    <Modal accessible={false} visible={visible} transparent={true}>
      <TouchableOpacity
        accessible={false}
        style={componentStyles.container}
        activeOpacity={1}
        onPressOut={onClose}>
        <View style={componentStyles.modalWrapper}>
          <ScrollView
            accessible={false}
            directionalLockEnabled={true}
            contentContainerStyle={componentStyles.scrollModal}>
            <TouchableWithoutFeedback accessible={false}>
              {children}
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    width: '95%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  scrollModal: {
    backgroundColor: 'white',
    padding: 20,
  },
});

export default CommonOverlay;
