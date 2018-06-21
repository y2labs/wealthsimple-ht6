import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { get, debounce } from 'lodash';
import { interactWithPetMutation } from 'graphql/pets';
import { getCurrentUserPetQuery } from 'graphql/users';
import Pet from './Pet';

class Display extends Component {
  constructor() {
    super();

    this.interactionsQueue = [];
    this.handleInteraction = debounce(this.handleInteraction, 500);
  }

  componentDidMount() {
    this.flushInterval = setInterval(this.flushInteractions, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.flushInterval);
  }

  render() {
    return (
      <Query query={getCurrentUserPetQuery}>
        {props => {
          const pet = get(props.data, 'viewer.me.pet');

          return (
            <div className="pet-display--container">
              <Pet onInteraction={this.handleInteraction} {...pet} />
            </div>
          );
        }}
      </Query>
    );
  }

  flushInteractions = () => {
    if (this.interactionsQueue.length !== 0) {
      this.props.onInteractions(this.interactionsQueue);

      this.interactionsQueue.slice(0, this.interactionsQueue.length - 1);
    }
  };

  handleInteraction = interactionType => {
    this.interactionsQueue.push({
      type: interactionType
    });
  };
}

const WithInteractionsMutation = () => (
  <Mutation mutation={interactWithPetMutation}>
    {onInteractions => {
      const handleInteractions = interactions => {
        onInteractions({
          variables: { interactions }
        });
      };

      return <Display onInteractions={handleInteractions} />;
    }}
  </Mutation>
);

export default WithInteractionsMutation;
