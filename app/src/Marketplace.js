import './Inventory.css';

import React from 'react';
import { Query } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import { getCurrentUserPurchaseableItemsQuery } from 'graphql/items';
import ItemCard from 'ItemCard';

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

        return purchaseableItems.map(purchaseableItem => {
          return (
            <ItemCard
              key={purchaseableItem.id}
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
