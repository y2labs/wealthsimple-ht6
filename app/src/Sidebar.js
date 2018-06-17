import React from 'react';
import { Query } from 'react-apollo';
import { getCurrentUserQuery } from 'graphql/users';

const Sidebar = () => {
  return (
    <Query query={getCurrentUserQuery}>
      {props => {
        if (props.loading) {
          return null;
        }

        const { me } = props.data.viewer;

        return (
          <div className="sidebar--container">
            <p className="h4-sans">{me.name}</p>
          </div>
        );
      }}
    </Query>
  );
};

export default Sidebar;
