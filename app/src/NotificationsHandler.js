import React, { Component } from 'react';

class NotificationsHandler extends Component {
  componentDidMount() {
    const { hash } = window.location;

    if (hash) {
      // const a = document.createElement('a');
      // a.href = hash;
      // a.click();
      // console.log(a);
    }
  }

  render() {
    return null;
  }
}

export default NotificationsHandler;
