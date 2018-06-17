import './SidebarUserInfo.css';

import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { getCurrentUserQuery } from 'graphql/users';

const SidebarUserInfo = () => {
  return (
    <Query query={getCurrentUserQuery}>
      {({ data, loading }) => {
        const user = get(data, 'viewer.me');

        return (
          <div className="">
            <div>
              <p className="sidebar-pet-info--attr-title">
                Lifetime free dollars earned
              </p>

              <p className="h4-sans-normal">
                {loading ? (
                  'Loading'
                ) : (
                  <Fragment>
                    <span className="sidebar-user-info--dollar-sign">$</span>
                    <span className="sidebar-user-info--dollar">
                      {(user.lifetimeDollarsManagedEarned / 100).toFixed(2)}
                    </span>
                  </Fragment>
                )}
              </p>
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default SidebarUserInfo;
