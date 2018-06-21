import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import App from './App';
import webPushManager from 'web-push-manager';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/api`,

  request: operation => {
    const token = localStorage.getItem('token');

    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  onError: ({ graphQLErrors }) => {
    if (graphQLErrors && graphQLErrors.length !== 0) {
      const [error] = graphQLErrors;

      if (error.message.match(/authorization/gi)) {
        localStorage.removeItem('token');

        window.location.href = '/';
      }
    }
  }
});

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<ApolloApp />, document.getElementById('root'));

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.ready.then(registration => {
    webPushManager.setManager(registration.pushManager);
  });
}

OfflinePluginRuntime.install({
  onUpdateReady: () => {
    OfflinePluginRuntime.applyUpdate();
  },

  onUpdated: () => {
    window.appUpdateAvailable = true;
  }
});
