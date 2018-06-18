import React from 'react';
import AuthenticatedRoute from 'AuthenticatedRoute';
import { Consumer } from 'AuthenticationProvider';

const LoginPage = () => (
  <Consumer>
    {({ onLogin }) => (
      <div>
        <button onClick={onLogin} className="button primary-action">
          Login
        </button>
      </div>
    )}
  </Consumer>
);

const LoginRoute = () => (
  <AuthenticatedRoute reverse>
    <LoginPage />
  </AuthenticatedRoute>
);

export default LoginRoute;
