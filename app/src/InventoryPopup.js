import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation, Query } from 'react-apollo';
import {
  useItemMutation,
  getPurchasedItemByIdQuery,
  getCurrentUserPurchasedItemsQuery
} from 'graphql/items';
import ItemPopup from 'ItemPopup';
import { getCurrentUserQuery, getCurrentUserPetQuery } from 'graphql/users';

const createUseItemMutationUpdate = ({ itemId }) => (
  cache,
  { data: { useItem } }
) => {
  if (useItem.error || !useItem.success) {
    return;
  }

  const { purchasedItems } = cache.readQuery({
    query: getCurrentUserPurchasedItemsQuery
  });

  const updatedPurchasedItems = purchasedItems.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        usedAt: new Date()
      };
    }

    return item;
  });

  cache.writeQuery({
    query: getCurrentUserPurchasedItemsQuery,
    data: {
      purchasedItems: updatedPurchasedItems
    }
  });
};

const WithQueryInventoryPopup = ({
  history,
  match: {
    params: { id }
  }
}) => (
  <Mutation
    mutation={useItemMutation}
    update={createUseItemMutationUpdate({ itemId: id })}
  >
    {(useItem, { loading: isUsingItem }) => (
      <Query skip={!id} query={getPurchasedItemByIdQuery} variables={{ id }}>
        {({ loading, data }) => {
          const handleClose = () => {
            if (history.length === 1) {
              history.replace('/dashboard');

              return;
            }

            history.goBack();
          };

          const props = {
            onUse: async () => {
              const { data } = await useItem({
                variables: { id },
                refetchQueries: [
                  {
                    query: getCurrentUserPetQuery
                  }
                ]
              });

              if (data && data.useItem.success) {
                handleClose();
              }
            },

            isLoading: isUsingItem || loading,
            onClose: handleClose,
            disabled: loading,
            useable: true
          };

          if (!loading) {
            props.disabled = !data.purchasedItem.item.singleUse;
            props.item = data.purchasedItem.item;
          }

          return <ItemPopup {...props} />;
        }}
      </Query>
    )}
  </Mutation>
);

export default withRouter(WithQueryInventoryPopup);
