import React, { Component } from 'react';
import AuthenticationProvider from 'AuthenticationProvider';
import Routes from 'Routes';
import NotificationsManager from 'NotificationsManager';
import NotificationsHandler from 'NotificationsHandler';

class App extends Component {
  render() {
    return (
      <AuthenticationProvider>
        <NotificationsManager />
        <NotificationsHandler />

        <Routes />
      </AuthenticationProvider>
    );
  }
}

export default App;
