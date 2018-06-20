import './MarketPlacePopup.css';

import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import {
  getPurchaseableItemByIdQuery,
  purchaseItemMutation,
  getCurrentUserPurchasedItemsQuery,
  getCurrentUserPurchaseableItemsQuery
} from 'graphql/items';
import ItemPopup from 'ItemPopup';

const purchaseItemMutationUpdate = ({ id }) => (
  cache,
  { data: { purchaseItem } }
) => {
  // If we had an error or did not succeed, we can't update the state.
  if (purchaseItem.error || !purchaseItem.success) {
    return;
  }

  const { purchasedItems } = cache.readQuery({
    query: getCurrentUserPurchasedItemsQuery
  });

  const { purchaseableItems } = cache.readQuery({
    query: getCurrentUserPurchaseableItemsQuery
  });

  cache.writeQuery({
    query: getCurrentUserPurchasedItemsQuery,
    data: { purchasedItems: purchasedItems.concat(purchaseItem.purchasedItem) }
  });

  cache.writeQuery({
    query: getCurrentUserPurchaseableItemsQuery,
    data: {
      purchaseableItems: purchaseableItems.filter(
        ({ id: previouslyPurchaseableItemId }) =>
          previouslyPurchaseableItemId !== id
      )
    }
  });
};

const WithQueryMarketPlacePopup = ({
  history,
  match: {
    params: { id }
  }
}) => (
  <Mutation
    mutation={purchaseItemMutation}
    update={purchaseItemMutationUpdate({ id })}
  >
    {(purchaseItem, { loading: purchasing }) => (
      <Query skip={!id} query={getPurchaseableItemByIdQuery} variables={{ id }}>
        {({ loading, data }) => {
          const handleClose = () => {
            if (history.length === 1) {
              history.replace('/dashboard');

              return;
            }

            history.goBack();
          };

          const props = {
            onPurchase: async () => {
              await purchaseItem({
                variables: {
                  id: data.purchaseableItem.id
                }
              });

              handleClose();
            },

            isLoading: purchasing || loading,
            onClose: handleClose,
            purchaseable: true
          };

          if (!loading) {
            props.item = data.purchaseableItem.item;
            props.price = data.purchaseableItem.price;
            props.expiresAt = data.purchaseableItem.expiresAt;
          }

          return <ItemPopup {...props} />;
        }}
      </Query>
    )}
  </Mutation>
);

export default withRouter(WithQueryMarketPlacePopup);
