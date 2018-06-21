import './Inventory.css';

import React from 'react';
import { Query } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import { getCurrentUserPurchaseableItemsQuery } from 'graphql/items';
import ItemCard from 'ItemCard';

const EmptyState = () => (
  <div className="inventory--empty-state-container">
    <p>No items can be found in the marketplace - check back later!</p>
  </div>
);

const itemSort = (a, b) =>
  new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();

const MarketPlace = () => (
  <div className="inventory--container">
    <Query query={getCurrentUserPurchaseableItemsQuery}>
      {props => {
        if (props.loading) {
          return null;
        }

        const purchaseableItems = props.data.purchaseableItems
          .filter(({ expiresAt }) => moment(expiresAt).isAfter(moment()))
          .sort(itemSort);

        if (purchaseableItems.length === 0) {
          return <EmptyState />;
        }

        return purchaseableItems.map(purchaseableItem => {
          return (
            <ItemCard
              key={purchaseableItem.id}
              href={`/dashboard/market/${purchaseableItem.id}`}
              name={purchaseableItem.item.name}
              description={purchaseableItem.item.description}
              expiresAt={purchaseableItem.expiresAt}
              price={purchaseableItem.price}
              image={get(purchaseableItem.item, 'image.uri')}
            />
          );
        });
      }}
    </Query>
  </div>
);

export default MarketPlace;
