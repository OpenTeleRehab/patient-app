/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Header, Button, CheckBox, withTheme, Text} from 'react-native-elements';
import {ScrollView, View} from 'react-native';
import styles from '../../assets/styles';
import {ROUTES} from '../../variables/constants';

const TermOfService = ({theme, navigation}) => {
  const [acceptAgreement, setAcceptAgreement] = useState(false);

  return (
    <>
      <Header
        centerComponent={{
          text: 'Terms of Services',
          style: {color: theme.colors.white},
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View>
          <CheckBox
            title="I agree to Terms of Service."
            checked={acceptAgreement}
            onPress={() => setAcceptAgreement(!acceptAgreement)}
            containerStyle={{
              borderWidth: 0,
              padding: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
          />
          <Text>View Hi humanity & inclusion Terms of Services</Text>
          <Button
            title="View Hi humanity & inclusion Terms of Services"
            onPress={() => navigation.navigate(ROUTES.TERM_OF_SERVICE_DETAIL)}
          />
          <Button
            title="Next"
            disabled={!acceptAgreement}
            onPress={() => navigation.navigate(ROUTES.SETUP_PIN)}
          />
          <Button
            icon={{
              name: 'chevron-left',
              size: 25,
              color: theme.colors.primary,
            }}
            title="Back"
            type="clear"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(TermOfService);
