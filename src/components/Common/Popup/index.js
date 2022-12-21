/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import styles from '../../../assets/styles';
import {Button, Icon} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';

const CommonPopup = ({
  popup,
  iconType,
  iconName,
  tittle,
  message,
  onConfirm,
  onCancel,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <Modal animationType={'fade'} visible={popup} transparent={true}>
      <View style={styles.centeredView}>
        <View style={componentStyles.modalView}>
          <Icon
            name={iconName}
            type={iconType}
            iconStyle={componentStyles.icon}
          />
          <Text style={componentStyles.title}>{tittle}</Text>
          <Text style={componentStyles.message}>{message}</Text>
          <View style={[styles.modalButtonWrapper, styles.marginTopLg]}>
            {onCancel && (
              <Button
                title={translate('common.no')}
                onPress={onCancel}
                containerStyle={[
                  styles.modalButtonContainer,
                  styles.borderRadius,
                ]}
                buttonStyle={[styles.paddingY, styles.borderRadius]}
              />
            )}
            {onConfirm && (
              <Button
                title={translate('common.yes')}
                onPress={onConfirm}
                containerStyle={[
                  styles.modalButtonContainer,
                  styles.borderRadius,
                ]}
                buttonStyle={[styles.paddingY, styles.borderRadius]}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const componentStyles = StyleSheet.create({
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  icon: {
    fontSize: 40,
    color: 'black',
    padding: 10,
  },
  message: {
    textAlign: 'center',
  },
});

export default CommonPopup;
