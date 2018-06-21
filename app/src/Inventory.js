import './Inventory.css';

import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { getCurrentUserPurchasedItemsQuery } from 'graphql/items';
import ItemCard from 'ItemCard';

const EmptyState = () => (
  <div className="inventory--empty-state-container">
    <p>You haven't purchased any items.</p>

    <a
      href="#marketplace"
      className="button primary-action inventory--empty-state-button"
    >
      Visit Marketplace
    </a>
  </div>
);

const sortByPurchaseDate = (a, b) => (a.createdAt > b.createdAt ? -1 : 1);

const Inventory = () => (
  <div className="inventory--container">
    <Query query={getCurrentUserPurchasedItemsQuery}>
      {props => {
        if (props.loading) {
          return null;
        }

        const useableItems = props.data.purchasedItems
          .filter(({ usedAt }) => !usedAt)
          .sort(sortByPurchaseDate);

        if (useableItems.length === 0) {
          return <EmptyState />;
        }

        return useableItems.map(purchasedItem => {
          return (
            <ItemCard
              key={purchasedItem.id}
              href={`/dashboard/inventory/${purchasedItem.id}`}
              description={purchasedItem.item.description}
              purchasedOn={purchasedItem.createdAt}
              name={purchasedItem.item.name}
              image={get(purchasedItem.item, 'image.uri')}
            />
          );
        });
      }}
    </Query>
  </div>
);

export default Inventory;
