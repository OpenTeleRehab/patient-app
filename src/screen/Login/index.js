/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {View, Image} from 'react-native';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {patientLoginSuccess} from '../../redux/actions';
import styles from '../../assets/styles';

import logoBlue from '../../assets/images/logo-blue.png';

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
      <View style={styles.mainContainerLight}>
        <Image source={logoBlue} style={styles.authLogoBlue} />
        <Button onPress={this.handleLogin} title="Login" />
      </View>
    );
  }
}

const mapStateToProps = () => {
  return {};
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
