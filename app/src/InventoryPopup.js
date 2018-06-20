import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation, Query } from 'react-apollo';
import { useItemMutation, getPurchasedItemByIdQuery } from 'graphql/items';
import ItemPopup from 'ItemPopup';

const WithQueryInventoryPopup = ({
  history,
  match: {
    params: { id }
  }
}) => (
  <Mutation mutation={useItemMutation}>
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
              const { data } = await useItem({ variables: { id } });

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
