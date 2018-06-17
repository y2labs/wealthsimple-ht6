import React, { Component, createContext } from 'react';
import queryString from 'querystring';

const { Provider, Consumer } = createContext({
  isLoggedIn: false,
  token: null,

  onLogin: () => {}
});

export default class AuthenticationProvider extends Component {
  state = {
    token: null
  };

  // Handle parsing query string
  componentDidMount() {
    const urlQuery = window.location.search.substring(1);

    if (urlQuery) {
      const { token } = queryString.parse(urlQuery);

      localStorage.setItem('token', token);

      this.setState({ token });

      return;
    }

    const token = localStorage.getItem('token');

    if (token) {
      this.setState({ token });
    }
  }

  render() {
    const { token } = this.state;

    const contextValue = {
      token,
      onLogin: this.handleLogin,
      isLoggedIn: Boolean(token)
    };

    return <Provider value={contextValue}>{this.props.children}</Provider>;
  }

  handleLogin = () => {
    const qs = queryString.stringify({
      redirect_uri: window.location.href,
      type: 'redirect'
    });

    window.location.href = `${process.env.REACT_APP_SERVER_URL}/login?${qs}`;
  };
}

export { Consumer };
