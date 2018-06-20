import React from 'react';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import { getCurrentUserQuery } from 'graphql/users';

const Header = () => (
  <Query query={getCurrentUserQuery}>
    {props => {
      const userName = get(props.data, 'viewer.me.name');

      return (
        <div className="header--container">
          <div className="header--left-section">
            <p className="uppercase-sans header--title h5-sans">Lancelot</p>
          </div>

          <a href={process.env.REACT_APP_WEALTHSIMPLE_URL}>
            <p className="header--link">See your portfolio</p>
          </a>

          <p className="header--link">{userName}</p>
        </div>
      );
    }}
  </Query>
);

export default Header;
