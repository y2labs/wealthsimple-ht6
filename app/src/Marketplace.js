import './Inventory.css';

import React from 'react';
import { Query, Mutation } from 'react-apollo';
import moment from 'moment';
import { get } from 'lodash';
import {
  getCurrentUserPurchaseableItemsQuery,
  purchaseItemMutation
} from 'graphql/items';
import ItemCard from 'ItemCard';

const itemSort = (a, b) =>
  new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();

const MarketPlace = () => (
  <div className="inventory--container">
    <Mutation
      onCompleted={({ purchaseItem }) => {
        if (!purchaseItem.error) {
          window.location.reload();
        }
      }}
      mutation={purchaseItemMutation}
    >
      {purchaseItem => (
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
                  href={`/market/${purchaseableItem.id}`}
                  name={purchaseableItem.item.name}
                  description={purchaseableItem.item.description}
                  expiresAt={purchaseableItem.expiresAt}
                  price={purchaseableItem.price}
                  image={get(purchaseableItem.item, 'image.uri')}
                  onClick={() => {
                    // eslint-disable-next-line
                    const confirmed = confirm(
                      `Are you sure you want to purchase ${
                        purchaseableItem.item.name
                      }?`
                    );

                    if (confirmed) {
                      purchaseItem({ variables: { id: purchaseableItem.id } });
                    }
                  }}
                />
              );
            });
          }}
        </Query>
      )}
    </Mutation>
  </div>
);

export default MarketPlace;
