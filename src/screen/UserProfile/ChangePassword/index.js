/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Button} from 'react-native-elements';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import TextField from '../../../components/Common/TextField';

const ChangePassword = ({navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <>
      <HeaderBar
        backgroundPrimary={true}
        title={translate('password.change')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView style={[styles.mainContainerLight]}>
        <TextField
          label={translate('password.current')}
          variant="filled"
          secureTextEntry
          renderErrorMessage={false}
        />
        <TextField
          label={translate('password.new')}
          variant="filled"
          secureTextEntry
          renderErrorMessage={false}
        />
        <TextField
          label={translate('password.confirm_new')}
          variant="filled"
          secureTextEntry
          renderErrorMessage={false}
        />
        <Button
          title={translate('password.change')}
          onPress={() => {}}
        />
      </ScrollView>
    </>
  );
};

export default ChangePassword;
