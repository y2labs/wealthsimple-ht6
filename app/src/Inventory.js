import './Inventory.css';

import React from 'react';
import { Query } from 'react-apollo';
import { getCurrentUserPurchasedItemsQuery } from 'graphql/items';
import ItemCard from 'ItemCard';

const Inventory = () => (
  <div className="inventory--container">
    <Query query={getCurrentUserPurchasedItemsQuery}>
      {props => {
        if (props.loading) {
          return null;
        }

        const useableItems = props.data.purchasedItems.filter(
          ({ usedAt }) => !usedAt
        );

        return useableItems.map(purchasedItem => {
          return (
            <ItemCard
              key={purchasedItem.id}
              description={purchasedItem.item.description}
              purchasedOn={purchasedItem.createdAt}
              name={purchasedItem.item.name}
            />
          );
        });
      }}
    </Query>
  </div>
);

export default Inventory;
