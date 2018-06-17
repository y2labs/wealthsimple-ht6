import React from 'react';
import { Redirect } from 'react-router-dom';
import { Consumer } from 'AuthenticationProvider';

const AuthenticatedRoute = ({ children, reverse }) => (
  <Consumer>
    {({ isLoggedIn }) => {
      if (isLoggedIn) {
        if (reverse) {
          return <Redirect to="/dashboard" />;
        }

        return children;
      }

      return reverse ? children : <Redirect to="/login" />;
    }}
  </Consumer>
);

export default AuthenticatedRoute;
