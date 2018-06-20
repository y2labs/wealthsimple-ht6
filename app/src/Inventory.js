import './Inventory.css';

import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import { getCurrentUserPurchasedItemsQuery } from 'graphql/items';
import ItemCard from 'ItemCard';

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
