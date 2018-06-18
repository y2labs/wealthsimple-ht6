import React, { Component } from 'react';
import AuthenticationProvider from 'AuthenticationProvider';
import Routes from 'Routes';

class App extends Component {
  componentDidMount() {
    if (Notification.permission === "granted") this.notify();
  }

  notify() {
    // some sort of method to poll for new notifications?
    var notification = new Notification('TITLE', {
      // icon: '',
      body: 'TEST',
    });

    setTimeout(notification.close.bind(notification), 5000);
  }

  render() {
    return (
      <AuthenticationProvider>
        <Routes />
      </AuthenticationProvider>
    );
  }
}

export default App;
