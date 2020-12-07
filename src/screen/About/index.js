/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {Text, Header} from 'react-native-elements';

class About extends React.Component {
  render() {
    return (
      <>
        <Header leftComponent={{icon: 'menu', color: '#ffffff'}} />
        <Text>About Screen</Text>
      </>
    );
  }
}

export default About;
