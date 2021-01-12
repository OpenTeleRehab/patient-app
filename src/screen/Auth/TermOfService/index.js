/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Button, CheckBox, withTheme, Text} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import styles from '../../../assets/styles';
import {ROUTES} from '../../../variables/constants';
import HeaderBar from '../../../components/Common/HeaderBar';

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
      <HeaderBar title="Terms of Services" />
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
            title="NEXT"
            disabled={!acceptAgreement}
            onPress={() => navigation.navigate(ROUTES.SETUP_PIN)}
            containerStyle={styles.marginTop}
          />
          <Button
            icon={{
              name: 'chevron-left',
              type: 'font-awesome-5',
              color: theme.colors.primary,
              size: 28,
            }}
            title="BACK"
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
