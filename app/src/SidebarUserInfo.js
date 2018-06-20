import './SidebarUserInfo.css';

import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import accounting from 'accounting';
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
                Total earned from caring for pet
              </p>

              <p className="h4-sans-normal">
                {loading ? (
                  'Loading'
                ) : (
                  <Fragment>
                    <span className="sidebar-user-info--dollar-sign">$</span>
                    <span className="sidebar-user-info--dollar">
                      {accounting.formatNumber(
                        user.lifetimeDollarsManagedEarned / 100,
                        '2'
                      )}
                    </span>
                  </Fragment>
                )}
              </p>
            </div>

            <div>
              <p className="sidebar-pet-info--attr-title">
                Total earned from referrals
              </p>
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default SidebarUserInfo;
