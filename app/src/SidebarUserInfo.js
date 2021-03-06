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
          <div>
            <p>Free dollars managed earned</p>

            <div>
              <p className="sidebar-pet-info--attr-title">
                Through taking care of pet
              </p>

              <p className="h4-sans-normal sidebar-pet-info--section">
                {loading ? (
                  'Loading'
                ) : (
                  <Fragment>
                    <span className="sidebar-user-info--dollar-sign">$</span>
                    <span className="sidebar-user-info--dollar">
                      {user
                        ? accounting.formatNumber(
                            user.lifetimeDollarsManagedEarned / 100,
                            '2'
                          )
                        : 0}
                    </span>
                  </Fragment>
                )}
              </p>
            </div>

            <div className="h4-sans-normal sidebar-pet-info--section">
              <p className="sidebar-pet-info--attr-title">Through referrals</p>

              <span className="sidebar-user-info--dollar-sign">$</span>
              <span className="sidebar-user-info--dollar">
                {accounting.formatNumber(20000, '2')}
              </span>
              <a
                href={process.env.REACT_APP_REFERRAL_PAGE_URL}
                className="sidebar-pet-info--visit-profile"
              >
                Visit your public profile
              </a>
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default SidebarUserInfo;
