import React, { Component } from 'react';
import Pet from './Pet';
import { Query } from 'react-apollo';
import { getCurrentUserPetQuery } from 'graphql/users';

export default class Display extends Component {
  render() {
    return (
      <Query query={getCurrentUserPetQuery}>
        {props => {
          return (
            <div className="pet-display--container">
              {/* {items.map(item => {
                return (
                  <img
                    src={item}
                    style={{
                      top: '50%',
                      left: '50%',
                      width: 'auto',
                      position: 'absolute',
                      zIndex: 2
                    }}
                  />
                );
              })} */}
              <Pet />
            </div>
          );
        }}
      </Query>
    );
  }
}
