/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Header, Button, CheckBox, withTheme, Text} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import styles from '../../../assets/styles';
import {ROUTES} from '../../../variables/constants';

const customStyles = {
  termDetailLink: {
    marginTop: 26,
    marginBottom: 86,
  },
};
const TermOfService = ({theme, navigation}) => {
  const [acceptAgreement, setAcceptAgreement] = useState(false);

  return (
    <>
      <Header
        leftComponent={
          <Button
            icon={{
              name: 'chevron-left',
              size: 25,
              color: theme.colors.white,
            }}
            title="Back"
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: 'Terms of Services Detail',
          style: {color: theme.colors.white},
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.paddingMd}>
          <CheckBox
            title="I agree to Terms of Service."
            checked={acceptAgreement}
            onPress={() => setAcceptAgreement(!acceptAgreement)}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.TERM_OF_SERVICE_DETAIL)}
            style={customStyles.termDetailLink}>
            <Text style={styles.hyperlink}>
              View Hi humanity & inclusion Terms of Services
            </Text>
          </TouchableOpacity>
          <Button
            title="Next"
            disabled={!acceptAgreement}
            onPress={() => navigation.navigate(ROUTES.SETUP_PIN)}
            containerStyle={styles.marginTop}
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
            containerStyle={styles.marginTop}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(TermOfService);
