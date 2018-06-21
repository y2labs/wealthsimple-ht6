import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { getCurrentUserPetQuery } from 'graphql/users';
import Pet from './Pet';

export default class Display extends Component {
  render() {
    return (
      <Query query={getCurrentUserPetQuery}>
        {props => {
          const pet = get(props.data, 'viewer.me.pet');

          return (
            <div className="pet-display--container">
              <Pet {...pet} />
            </div>
          );
        }}
      </Query>
    );
  }
}
