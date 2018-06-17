import React, { Component } from 'react';
import AuthenticationProvider from 'AuthenticationProvider';
import Routes from 'Routes';

class App extends Component {
  render() {
    return (
      <AuthenticationProvider>
        <Routes />
      </AuthenticationProvider>
    );
  }
}

export default App;
