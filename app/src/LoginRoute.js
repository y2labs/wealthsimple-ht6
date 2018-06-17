import React from 'react';
import AuthenticatedRoute from 'AuthenticatedRoute';

const LoginPage = () => (
  <div>
    <button className="button primary-action">Login</button>
  </div>
);

const LoginRoute = () => (
  <AuthenticatedRoute reverse>
    <LoginPage />
  </AuthenticatedRoute>
);

export default LoginRoute;
