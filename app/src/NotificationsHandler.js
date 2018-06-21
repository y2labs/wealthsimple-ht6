import { Component } from 'react';

const waitForElementOffscreen = selector => {
  return new Promise(resolve => {
    const el = document.querySelector(selector);

    if (el) {
      // TODO: Try to figure it out
      const isElOffscreen = el.offsetTop >= window.innerHeight - 200;

      if (isElOffscreen) {
        resolve(el);

        return;
      }
    }

    setTimeout(() => {
      resolve(waitForElementOffscreen(selector));
    }, 400);
  });
};

class NotificationsHandler extends Component {
  componentDidMount() {
    this.goToHash();
  }

  render() {
    return null;
  }

  goToHash = async () => {
    const hash = window.location.hash.substr(1);

    if (hash) {
      const anchor = await waitForElementOffscreen(`[href="#${hash}"]`);

      anchor.dispatchEvent(new MouseEvent('click'));
    }
  };
}

export default NotificationsHandler;
