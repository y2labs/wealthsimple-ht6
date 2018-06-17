import React from 'react';
import { Query } from 'react-apollo';
import { getCurrentUserQuery } from 'graphql/users';

const Header = () => (
  <Query query={getCurrentUserQuery}>
    {props => {
      return <div className="header--container">Paul Xu</div>;
    }}
  </Query>
);

export default Header;
