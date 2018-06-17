import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import App from './App';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/api`,

  request: operation => {
    const token = localStorage.getItem('token');

    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
});

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<ApolloApp />, document.getElementById('root'));

registerServiceWorker();
