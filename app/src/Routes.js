import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { Consumer } from 'AuthenticationProvider';
import Dashboard from 'DashboardRoute';
import Login from 'LoginRoute';

const AuthenticationCatchAll = () => (
  <Consumer>
    {({ isLoggedIn }) => {
      const nextPath = isLoggedIn ? '/dashboard' : '/login';

      return <Redirect to={nextPath} />;
    }}
  </Consumer>
);

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="*" component={AuthenticationCatchAll} />
    </Switch>
  </Router>
);

export default Routes;
