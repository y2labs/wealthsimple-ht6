import React, { Component } from 'react';
import webPushManager from 'web-push-manager';
import { Consumer } from 'AuthenticationProvider';
import { Mutation } from 'react-apollo';
import { subscribeToWebPushMutation } from 'graphql/users';

class NotificationsManager extends Component {
  componentDidMount() {
    this.subscribe();
  }

  subscribe = async () => {
    const notificationState = await Notification.requestPermission();

    if (notificationState === 'granted') {
      const subscription = await webPushManager.subscribe();
      const { keys, endpoint } = subscription.toJSON();

      this.props.onSubscribe({
        keys,
        endpoint
      });
    }
  };

  render() {
    return null;
  }
}

const AuthenticatedNotificationsManager = () => (
  <Mutation mutation={subscribeToWebPushMutation}>
    {subscribeToWebPush => (
      <Consumer>
        {({ isLoggedIn }) => {
          if (isLoggedIn) {
            return (
              <NotificationsManager
                onSubscribe={subscription => {
                  subscribeToWebPush({
                    variables: { webPushSubscription: subscription }
                  });
                }}
              />
            );
          }

          return null;
        }}
      </Consumer>
    )}
  </Mutation>
);

export default AuthenticatedNotificationsManager;
