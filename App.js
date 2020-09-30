import React from 'react';
import {Header, ThemeProvider} from 'react-native-elements';

const theme = {};

const App: () => React$Node = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header
        leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={{text: 'MY TITLE', style: {color: '#fff'}}}
        rightComponent={{icon: 'home', color: '#fff'}}
      />
    </ThemeProvider>
  );
};

export default App;
