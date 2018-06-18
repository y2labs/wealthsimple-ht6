import React, { Component } from 'react';
import AuthenticationProvider from 'AuthenticationProvider';
import Routes from 'Routes';
import NotificationsManager from 'NotificationsManager';

class App extends Component {
  render() {
    return (
      <AuthenticationProvider>
        <NotificationsManager />
        <Routes />
      </AuthenticationProvider>
    );
  }
}

export default App;
