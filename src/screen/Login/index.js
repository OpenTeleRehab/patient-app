/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {View, Image} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button, Card, Input, Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {patientLoginSuccess} from '../../redux/actions';
import styles from '../../assets/styles';

import logoWhite from '../../assets/images/logo-white.png';

class Login extends React.Component {
  handleLogin = () => {
    const data = {
      id: 1,
      firstName: 'Luke',
      lastName: 'Cameron',
      mobile: '012222333',
      accessToken: 'CIkc4AwU5c5mC7h8vcpdRqV99w6nS5nm',
      isFirstTimeLogin: false,
    };
    this.props.patientLoginSuccess(data);
  };

  render() {
    return (
      <>
        <View style={styles.authBanner}>
          <Image source={logoWhite} style={styles.authLogoWhite} />
        </View>
        <Card>
          <Input
            label="Enter your mobile number"
            labelStyle={styles.formLabel}
            inputStyle={styles.formControl}
            inputContainerStyle={styles.noneBorderBottom}
          />
          <View>
            <Text>Language</Text>
            <Picker prompt="Language">
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Vietnam" value="vn" />
            </Picker>
          </View>
          <Button onPress={() => this.handleLogin()} title="Login" />
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    patient: state.patient,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      patientLoginSuccess,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
